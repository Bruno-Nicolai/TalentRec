import { CalendarOutlined } from '@ant-design/icons';
import { Badge, Card, List } from 'antd';
import { Text } from '../text';
import { UESkeleton } from '..';
import { getDate } from '@/utilities/helpers';
import { useList } from '@refinedev/core';
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from '@/graphql/queries';
import dayjs from 'dayjs';

const UpcomingEvents = () => {

    const { data, isLoading } = useList({
        resource: 'events',
        pagination: { pageSize: 5 },
        sorters: [
            { 
                field: 'startDate',
                order: 'asc',
            }
        ],
        filters: [
            { 
                field: 'startDate',
                operator: 'gte', // not like gta. It means greater than
                value: dayjs().format('YYYY-MM-DD'), 
            }
        ],
        meta: {
            gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
        },
    });
    // alert(JSON.stringify(data))

    return (
        <Card
            style={{ height: '100%' }}
            headStyle={{ padding: '8px 16px'}}
            bodyStyle={{ padding: '0 1rem' }}
            title={
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <CalendarOutlined />
                    <Text
                        size="sm"
                        style={{
                            marginLeft: ".7rem"
                        }}
                    >UpcomingEvents</Text>
                </div>
            }
        >
            {isLoading ? (
                <List
                    itemLayout="horizontal"
                    dataSource={Array.from({ length: 5 }).map((_, index) => ({
                        id: index,
                    }))}
                    renderItem={() => <UESkeleton />}
                />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={data?.data || []}
                    renderItem={(item) => {
                        
                        const renderDate = getDate(item.startDate, item.endDate)
                        return (
                            <List.Item>
                                <List.Item.Meta 
                                    avatar={<Badge color={item.color} />}
                                    title={<Text size="xs">{renderDate}</Text>}
                                    description={<Text ellipsis={{ tooltip: true }} strong>
                                        {item.title}
                                    </Text>}
                                />
                            </List.Item>
                        )
                    }}
                />
            )}

            {!isLoading && data?.data.length === 0 && (
                <span
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '220px',
                    }}
                >
                    No Upcoming Events
                </span>
            )}

        </Card>
    )
}

export default UpcomingEvents