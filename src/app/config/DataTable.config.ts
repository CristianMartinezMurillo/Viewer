import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataTableConfig {
    get(paginator) {
        paginator._intl.firstPageLabel     = 'Inicio';
        paginator._intl.lastPageLabel      = 'Última página';
        paginator._intl.nextPageLabel      = 'Siguiente';
        paginator._intl.previousPageLabel  = 'Atrás';
        paginator._intl.itemsPerPageLabel  = 'Elementos por página';
    }
}