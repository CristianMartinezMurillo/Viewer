import { NgModule } from "@angular/core";
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DATE_FORMAT } from "./_constants/date-format";
import {
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSlideToggleModule,
    ErrorStateMatcher,
    MatMenuModule,
    MatExpansionModule,
    MatRadioModule,
    MatTabsModule,
    MatTreeModule,
    MatDatepickerModule,
    MatStepperModule,
    DateAdapter,
    MAT_DATE_LOCALE,
    MAT_DATE_FORMATS,
    MatBadgeModule
} from '@angular/material';


@NgModule({

    imports: [
    ],

    exports: [
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatCardModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatExpansionModule,
        MatRadioModule,
        MatTabsModule,
        MatTreeModule,
        MatMomentDateModule,
        MatDatepickerModule,
        MatStepperModule,
        MatBadgeModule
    ],
    providers: [
        ErrorStateMatcher,
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
    ]

})

export class MaterialModule {}
