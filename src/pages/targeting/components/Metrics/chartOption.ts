import { IntlShape } from 'react-intl';
import { externalTooltipHandler } from "./chartTooltip";
import { IMetric } from 'interfaces/targeting';

export const createChartOptions = (metric: IMetric[], projectKey: string, environmentKey: string, toggleKey: string, intl: IntlShape): any => {
  const config = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
      },
      annotation: {
        annotations: {}
      }
    },
    scales: {
      x: {
        offset: true,
        grid: {
          display: false,
        }
      },
      y: {
        offset: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.07)',
          borderDash: [5],
          drawBorder: false,
        },
      },
    },
  };

  metric.forEach((item: IMetric, index: number) => {
    if (item.lastChangeVersion !== undefined) {
      const key = 'line' + index;
      // @ts-ignore
      config.plugins.annotation.annotations[key] = {
        type: 'line',
        xMin: index,
        xMax: index,
        borderColor: '#FFEBE9',
        borderWidth: 1,
        click: () => {
          window.open(`/${projectKey}/${environmentKey}/${toggleKey}/targeting?currentVersion=${item.lastChangeVersion}`)
        },
        label: {
          enabled: true,
          backgroundColor: '#FEF3F2',
          color: '#F55043',
          content: () => intl.formatMessage({id: 'common.version.change.text'}),
          position: 'start',
          xAdjust: 29,
          yAdjust: -8,
          borderRadius: {
            topLeft: 0,
            topRight: 4,
            bottomLeft: 0,
            bottomRight: 4,
          }
        }
      }
    }
  })
  return config;
};
  