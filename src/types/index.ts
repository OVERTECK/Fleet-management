export interface Car {
    vin: string;
    model: string;
    number: string;
    status: 'active' | 'maintenance' | 'inactive';
    totalKM: number;
}

export interface Driver {
    id: string;
    name: string;
    lastName: string;
    pathronymic?: string;
    contactData: string;
    categoryDrive: string;
}

export interface Trip {
    id: string;
    carId: string;
    driverId: string;
    timeStart: string;
    timeEnd: string;
    traveledKM: number;
    consumptionLitersFuel: number;
}

export interface Assignment {
    id: string;
    carId: string;
    driverId: string;
    start: string;
    end: string;
}

export interface MaintenanceRecord {
    id: string;
    carId: string;
    typeWork: string;
    price: number;
    date: string;
}

export interface Refueling {
    id: string;
    carId: string;
    refilledLiters: number;
    price: number;
    date: string;
}

export interface Route {
    id: string;
    start: string;
    end: string;
    countKM: number;
}

// Типы для запросов создания
export interface CreateDriverRequest {
    name: string;
    lastName: string;
    pathronymic?: string;
    contactData: string;
    categoryDrive: string;
}

export interface CreateCarRequest {
    vin: string;
    model: string;
    number: string;
    status: string;
    totalKM: number;
}

export interface CreateAssignmentRequest {
    carId: string;
    driverId: string;
    start: string;
    end: string;
}

export interface CreateMaintenanceRecordRequest {
    carId: string;
    typeWork: string;
    price: number;
    date: string;
}

export interface CreateRefuelingRequest {
    carId: string;
    refilledLiters: number;
    price: number;
    date: string;
}

export interface CreateTripRequest {
    carId: string;
    driverId: string;
    timeStart: string;
    timeEnd: string;
    traveledKM: number;
    consumptionLitersFuel: number;
}