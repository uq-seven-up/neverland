export interface IBusTime {
    route_id: string;
    trip_id: string;
    departure_date: string;
    trip_headsign: string;
}

export interface IBusTimes{
    items: IBusTime[]
}