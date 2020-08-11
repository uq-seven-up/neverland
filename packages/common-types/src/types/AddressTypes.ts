export type Email = {
    address:string,
    verified:boolean
}

export type ContactTitle = {
    id:number,
    name:string
};

export type ContactName = {
    guid:string,
    isEntity:boolean,
    name:string,
    title:ContactTitle,
    firstname:string,
    lastname:string
}

export type Street = {
    isPlace:boolean,
    no:string,
    name:string,
    line:string
};

export type Country = {
    id:number,
    name:string
}

export type Address = {
    type:string,
    street:Street,
    city:string,
    state:string,
    postcode:string,
    country:Country
}

export type Phone = {
    type:string,
    country:string,
    area:string,
    local:string,
    verified:boolean
}

export type AddressZone = {
    city:string,
    region:string,
    postcode:string,
}