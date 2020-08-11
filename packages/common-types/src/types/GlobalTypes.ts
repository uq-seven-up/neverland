export interface Timezone {
    id:number,
    label:string,
    name:string,
}

export interface Image {
    state:number,
    name:string,
    src:string,
    thumb:string
}

export interface Coordinate {
    lat:number,
    lng:number
}

export interface Identity {
    guid:string,
    name:string,
}

export interface SearchFilter {
    term:string,
    page:number,
    rows:number,
    sidx:string,
    sord:"asc"|"desc"
}

export interface RecordSetMeta  
{
    /** Current page. */
    page:number,
    /** Total number of pages. */
    pageCount:number,
    /** Number of records on the current page. this may be smaller than requested page size. (e.g. on the first or last page) */
    count:number,
    /** Total number of records found accross all pages. */
    recordCount:number
}
