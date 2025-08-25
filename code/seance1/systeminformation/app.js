const si = require('systeminformation');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const chalk = require('chalk');

let darkMode = true;

// Création écran et grille
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen });

// Styles dark/light
const styles = {
  dark: {
    lineColor: 'green',
    textColor: 'white',
    baselineColor: 'black',
    logFg: 'green',
    gaugeStrokeRam: 'magenta',
    gaugeStrokeTemp: 'red',
    gaugeStrokeNet: 'cyan',
    tableFg: 'white'
  },
  light: {
    lineColor: 'green',
    textColor: 'black',
    baselineColor: 'white',
    logFg: 'black',
    gaugeStrokeRam: 'magenta',
    gaugeStrokeTemp: 'red',
    gaugeStrokeNet: 'blue',
    tableFg: 'black'
  }
};

// Création widgets
const lineCpu = grid.set(0, 0, 4, 6, contrib.line, {
  label: 'CPU Load (%)',
  showLegend: true,
  maxY: 100,
  minY: 0,
  xPadding: 5,
  xLabelPadding: 3,
  wholeNumbersOnly: true,
  style: { 
    line: styles.dark.lineColor, 
    text: styles.dark.textColor, 
    baseline: styles.dark.baselineColor 
  }
});

const gaugeRam = grid.set(0, 6, 2, 3, contrib.gauge, {
  label: 'RAM Usage',
  stroke: styles.dark.gaugeStrokeRam,
  fill: 'white'
});

const gaugeTemp = grid.set(2, 6, 2, 3, contrib.gauge, {
  label: 'CPU Temp',
  stroke: styles.dark.gaugeStrokeTemp,
  fill: 'white'
});

const lineNet = grid.set(4, 0, 4, 9, contrib.line, {
  label: 'Network (KB/s)',
  showLegend: true,
  maxY: 1000,
  wholeNumbersOnly: true,
  style: { line: styles.dark.gaugeStrokeNet, text: styles.dark.textColor, baseline: styles.dark.baselineColor }
});

const tableProcs = grid.set(8, 0, 4, 12, contrib.table, {
  label: 'Top Processes',
  columnWidth: [7, 25, 7, 7, 10],
  interactive: false,
  fg: styles.dark.tableFg,
  selectedFg: 'white',
  selectedBg: 'blue',
  columnSpacing: 2,
  keys: false,
  mouse: false,
  border: { type: 'line' }
});

const log = grid.set(0, 9, 8, 3, contrib.log, {
  label: 'System Logs & Alerts',
  fg: styles.dark.logFg,
  tags: true,
  scrollbar: {
    ch: ' ',
    track: { bg: 'grey' },
    style: { inverse: true }
  }
});

// Données CPU
const cpuData = { 
  title: 'CPU Usage',
  x: Array(20).fill('').map((_, i) => i.toString()),  // Pré-remplir avec des valeurs vides
  y: Array(20).fill(0)  // Pré-remplir avec des zéros
};
// Données réseau (upload/download)
const netData = {
  title: 'Up',
  x: Array(20).fill('').map((_, i) => i.toString()),
  y: Array(20).fill(0),
  title2: 'Down',
  y2: Array(20).fill(0)
};

let tick = 0;
let lastNetStats = null;

async function updateStats() {
  try {
    tick++;

    const [load, mem, temp, network, procs] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.cpuTemperature(),
      si.networkStats(),
      si.processes()
    ]);    // CPU graphique
    // Faire coulisser les données existantes
    for (let i = 0; i < cpuData.y.length - 1; i++) {
      cpuData.y[i] = cpuData.y[i + 1];
    }
    // Ajouter la nouvelle valeur à la fin
    cpuData.y[cpuData.y.length - 1] = Math.round(load.currentload);
    
    // Mise à jour du graphique
    lineCpu.setData([{ 
      title: cpuData.title, 
      x: cpuData.x, 
      y: cpuData.y,
      style: { 
        line: darkMode ? styles.dark.lineColor : styles.light.lineColor 
      }
    }]);

    // RAM & Temp jauges
    const ramUsedPct = (mem.active / mem.total) * 100;
    gaugeRam.setData([Math.round(ramUsedPct)]);
    gaugeTemp.setData([Math.round(temp.main) || 0]);

    // Réseau (calcul débit actuel)
    if (!lastNetStats) lastNetStats = network[0];
    const upSpeed = (network[0].tx_bytes - lastNetStats.tx_bytes) / 1024 / 2; // KB/s (interval 2s)
    const downSpeed = (network[0].rx_bytes - lastNetStats.rx_bytes) / 1024 / 2;
    lastNetStats = network[0];    // Faire coulisser les données réseau existantes
    for (let i = 0; i < netData.y.length - 1; i++) {
      netData.y[i] = netData.y[i + 1];
      netData.y2[i] = netData.y2[i + 1];
    }
    
    // Ajouter les nouvelles valeurs à la fin
    netData.y[netData.y.length - 1] = Math.round(upSpeed);
    netData.y2[netData.y2.length - 1] = Math.round(downSpeed);
    
    // Mise à jour du graphique réseau
    lineNet.setData([
      { 
        title: netData.title, 
        x: netData.x, 
        y: netData.y,
        style: { 
          line: darkMode ? styles.dark.gaugeStrokeNet : styles.light.gaugeStrokeNet 
        }
      },
      { 
        title: netData.title2, 
        x: netData.x, 
        y: netData.y2,
        style: { 
          line: darkMode ? styles.dark.gaugeStrokeNet : styles.light.gaugeStrokeNet 
        }
      }
    ]);

    // Top 10 processus par CPU%
    const topProcs = procs.list
      .filter(p => p.cpu > 0)
      .sort((a, b) => b.cpu - a.cpu)
      .slice(0, 10)
      .map(p => [
        p.pid.toString(),
        p.name.length > 23 ? p.name.slice(0, 20) + '...' : p.name,
        p.cpu.toFixed(1),
        (p.memResidentSet / 1024 / 1024).toFixed(1),
        p.state
      ]);
    tableProcs.setData({
      headers: ['PID', 'Process Name', 'CPU %', 'RAM MB', 'State'],
      data: topProcs
    });

    // Logs & alertes
    if (load.currentload > 80) {
      log.log(chalk.red.bold(`[ALERT] CPU load élevé: ${load.currentload.toFixed(1)}%`));
    } else {
      log.log(chalk.green(`CPU load normal: ${load.currentload.toFixed(1)}%`));
    }

    if (temp.main > 75) {
      log.log(chalk.red.bold(`[ALERT] Température CPU élevée: ${temp.main}°C`));
    }

    if (ramUsedPct > 80) {
      log.log(chalk.yellow.bold(`[WARNING] RAM utilisée à ${ramUsedPct.toFixed(1)}%`));
    }

    screen.render();
  } catch (err) {
    log.log(chalk.red(`[ERROR] ${err.message}`));
    screen.render();
  }
}

// Changer entre dark/light mode
function toggleDarkMode() {
  darkMode = !darkMode;
  const style = darkMode ? styles.dark : styles.light;

  lineCpu.options.style = { line: style.lineColor, text: style.textColor, baseline: style.baselineColor };
  gaugeRam.options.stroke = style.gaugeStrokeRam;
  gaugeTemp.options.stroke = style.gaugeStrokeTemp;
  lineNet.options.style = { line: style.gaugeStrokeNet, text: style.textColor, baseline: style.baselineColor };
  tableProcs.options.fg = style.tableFg;
  log.options.fg = style.logFg;

  screen.render();
}

// Setup toggle touche 'd'
screen.key(['d'], () => {
  toggleDarkMode();
  log.log(chalk.cyan(`Mode ${darkMode ? 'Dark' : 'Light'} activé`));
});

// Quitter avec ESC, q, Ctrl+C
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

// Initialisation des graphiques avec des données vides
lineCpu.setData([{
  title: cpuData.title,
  x: [0],
  y: [0],
  style: { line: darkMode ? styles.dark.lineColor : styles.light.lineColor }
}]);

// Premier appel et intervalle régulier
updateStats();
setInterval(updateStats, 2000);
