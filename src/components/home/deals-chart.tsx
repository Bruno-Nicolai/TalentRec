import { DollarOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import React from 'react'
import { Text } from '../text'
import { Area, AreaConfig } from '@ant-design/plots'
import { useList } from '@refinedev/core'
import { DASHBOARD_DEALS_CHART_QUERY } from '@/graphql/queries'
import { mapDealsData } from '@/utilities/helpers'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { DashboardDealsChartQuery } from '@/graphql/types'
import { coffeeTheme } from '@/config'

const DealsChart = () => {
  
  const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: 'dealStages',
    filters: [
      {
        field: 'title',
        operator: 'in',
        value: ['WON', 'LOST'],
      }
    ],
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
    }
  });

  const dealData = React.useMemo(() => {
    return mapDealsData(data?.data);
  }, [data?.data])

  const config: AreaConfig = {
    
    data: dealData,
    xField: 'timeText',
    yField: 'value',
    isStack: false,
    seriesField: 'state',
    startOnZero: false,
    smooth: true,
    animation: true,
    legend: {
      offsetY: -8,
    },
    yAxis: {
      tickCount: 6,
      label: {
        formatter: (v: string) => {
          return `$${Number(v) /1000}k`
        }
      },
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: data.state,
          value: `$${Number(data.value) /1000}k`,
        }
      }
    },
    areaStyle: (datum) => {

      const won = `l(270) 0:#fff 0.5:${coffeeTheme.token?.colorSuccess ?? "#FFE2C2"} 1:${coffeeTheme.token?.colorSuccess ?? "#FA761E"}`;
      const lost = `l(270) 0:#fff 0.5:${coffeeTheme.token?.colorError ?? "#4D4C48"} 1:${coffeeTheme.token?.colorError ?? "#0D0D02"}`;

      return { fill: datum.state === "Won" ? won : lost };

    },
    color: (datum) => {
      return datum.state === "Won" 
        ? coffeeTheme.token?.colorSuccess ?? "#FA761E"
        : coffeeTheme.token?.colorError ?? "#0D0D02" 
    },

  };

  return (
    <Card
      style={{ height: '100%' }}
      headStyle={{ padding: '8px 16px'}}
      bodyStyle={{ padding: '24px 24px 0 24px' }}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <DollarOutlined />
          <Text
            size="sm"
            style={{ marginLeft: '.5rem' }}
          >
            Deals
          </Text>
        </div>
      }
    >
      <Area {...config} height={325} />
    </Card>
  );
}

export default DealsChart