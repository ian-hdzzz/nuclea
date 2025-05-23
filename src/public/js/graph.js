
  document.addEventListener('DOMContentLoaded', function() {
    // Use the global initialization function if it exists
    if (window.initOrUpdateRadarChart) {
      window.initOrUpdateRadarChart('radar-chart');
    } else {
      // Fallback to local initialization if the global function isn't available
      // (This ensures the partial works even if usado independientemente)
      const container = document.querySelector('.chart-container');
      const ctx = document.getElementById('radar-chart').getContext('2d');
      
      // Verificar si ya existe un gráfico en este canvas
      let existingChart;
      try {
        existingChart = Chart.getChart(ctx.canvas);
      } catch (e) {
        console.error("Error checking for existing chart:", e);
      }
      
      if (!existingChart) {
        // Obtener datos de los atributos data-* si existen, o usar los del DOM
        function getValue(name, fallbackSelectorName) {
          const value = container.dataset[name];
          if (value !== undefined && value !== '') return parseFloat(value);
          const el = document.getElementsByName(fallbackSelectorName)[0];
          return el ? parseFloat(el.value) : 0;
        }

        const workload = getValue('workload', 'workload');
        const health = getValue('health', 'health');
        const recognition = getValue('recognition', 'recognition');
        const emotionalHealth = getValue('emotional', 'emotional-health');
        const workLifeBalance = getValue('balance', 'work-life-balance');

        const dataValues = [workload, health, recognition, emotionalHealth, workLifeBalance];
        const average = dataValues.reduce((a, b) => a + b, 0) / dataValues.length;

        let color;
        if (average <= 1.5) color = 'rgba(255, 0, 0';
        else if (average <= 2.5) color = 'rgba(255, 215, 0';
        else if (average <= 3.5) color = 'rgba(0, 128, 0';
        else color = 'rgba(4, 205, 250';

        const radarChart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: [
              'Workload',
              'Health',
              'Recognition',
              'Emotional-health',
              'Work-life-balance'
            ],
            datasets: [{
              label: '',
              data: dataValues,
              backgroundColor: `${color}, 0.5)`,
              borderColor: `${color}, 0.8)`,
              pointBackgroundColor: `${color}, 1)`,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: `${color}, 1)`
            }]
          },
          options: {
            scales: {
              r: {
                min: 0,
                max: 5,
                ticks: {
                  stepSize: 1,
                  display: true,
                  backdropColor: 'transparent'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                angleLines: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                pointLabels: {
                  color: '#fff',
                  font: {
                    size: 12
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });

        // Solo permitir actualización por selects si no hay valores predefinidos
        if (!container.dataset.workload) {
          const selects = document.querySelectorAll('select');
          selects.forEach(select => {
            select.addEventListener('change', function() {
              const workload = parseFloat(document.getElementsByName('workload')[0].value);
              const health = parseFloat(document.getElementsByName('health')[0].value);
              const recognition = parseFloat(document.getElementsByName('recognition')[0].value);
              const emotionalHealth = parseFloat(document.getElementsByName('emotional-health')[0].value);
              const workLifeBalance = parseFloat(document.getElementsByName('work-life-balance')[0].value);

              const newData = [workload, health, recognition, emotionalHealth, workLifeBalance];
              const avg = newData.reduce((a, b) => a + b, 0) / newData.length;

              let newColor;
              if (avg <= 1.5) newColor = 'rgba(255, 0, 0';
              else if (avg <= 2.5) newColor = 'rgba(255, 215, 0';
              else if (avg <= 3.5) newColor = 'rgba(0, 128, 0';
              else newColor = 'rgba(4, 205, 250';

              radarChart.data.datasets[0].data = newData;
              radarChart.data.datasets[0].backgroundColor = `${newColor}, 0.5)`;
              radarChart.data.datasets[0].borderColor = `${newColor}, 0.8)`;
              radarChart.data.datasets[0].pointBackgroundColor = `${newColor}, 1)`;
              radarChart.data.datasets[0].pointHoverBorderColor = `${newColor}, 1)`;
              radarChart.update();
            });
          });
        }
      }
    }
    
    // Botón guardar (si existe)
    document.getElementById('save-button')?.addEventListener('click', function() {

    });
  });
