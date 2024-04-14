import UpcomingEvents from './home/upcoming-events';
import DealsChart from './home/deals-chart';
import UESkeleton from './skeleton/upcoming-events';
import AccHdSkeleton from './skeleton/accordion-header';
import KbColSkeleton from './skeleton/kanban';
import ProjCardSkeleton from './skeleton/task-card';
import LtActSkeleton from './skeleton/latest-activities';
import DashboardTotalCountCard from './home/total-count-card'
import LatestActivities from './home/latest-activities'

export { 

    DashboardTotalCountCard,
    UpcomingEvents, 
    DealsChart, 
    LatestActivities, 
    
    UESkeleton,
    AccHdSkeleton,
    KbColSkeleton,
    ProjCardSkeleton,
    LtActSkeleton,
    
};

export * from "./accordion"
export * from "./tasks/form/description"
export * from "./tasks/form/due-date"
export * from "./tasks/form/header"
export * from "./tasks/form/stage"
export * from "./tasks/form/title"
export * from "./tasks/form/users"