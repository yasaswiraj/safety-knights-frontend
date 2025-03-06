import { Component } from '@angular/core';
import {
  MatTreeModule,
  MatTreeNestedDataSource,
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

const environmentalServicesOptions = [
  {
    name: 'Environmental Facility Compliance',
    children: [
      { name: 'Environmental Compliance Programs', selected: false },
      { name: 'Environmental Compliance Audits', selected: false },
      { name: 'Air Emission Permitting', selected: false },
      { name: 'Wastewater Permitting & Management', selected: false },
      {
        name: 'Storm Water Permitting & Management (SWPPP)',
        selected: false,
      },
      { name: 'Hazardous Waste Management', selected: false },
      { name: 'Spill / Discharge Planning (SPCC)', selected: false },
      { name: 'Chemical / Petroleum Bulk Storage', selected: false },
      { name: 'Chemical Management (EPCRA, TSCA, REACH)', selected: false },
      {
        name: 'Pollution Prevention / Toxics Use Reduction',
        selected: false,
      },
      { name: 'Agency Interface / Negotiation', selected: false },
      { name: 'Environmental Training', selected: false },
      { name: 'Environmental Program Outsourcing', selected: false },
      { name: 'ISO 14001 Auditing', selected: false },
      { name: 'ISO 14001 Certification', selected: false },
      { name: 'ISO 45001 Auditing', selected: false },
      { name: 'ISO 45001 Certification', selected: false },
    ],
  },
  {
    name: 'Property Transactions',
    children: [
      { name: 'Strategic Transaction Support', selected: false },
      { name: 'Phase I / II Site Assessment (ASTM, AAI)', selected: false },
      { name: 'EHS Compliance / Risk Evaluation', selected: false },
      {
        name: 'Hazardous Materials Survey (asbestos, lead, mold, PCBs)',
        selected: false,
      },
      { name: 'Liability Quantification / Cost Modeling', selected: false },
      {
        name: 'Post-Acquisition Integration / Optimization',
        selected: false,
      },
      { name: 'Pre-Divestiture Planning', selected: false },
      { name: 'Portfolio Management', selected: false },
    ],
  },
  {
    name: 'Field Activities / Construction',
    children: [
      { name: 'Soil and Groundwater Sampling', selected: false },
      { name: 'Contamination Delineation', selected: false },
      { name: 'Waste Profiling', selected: false },
      { name: 'Beneficial Reuse Determination', selected: false },
    ],
  },
  {
    name: 'Hazardous Building Materials Surveys',
    children: [
      { name: 'Asbestos', selected: false },
      { name: 'Lead', selected: false },
      { name: 'Mold', selected: false },
    ],
  },
];

const healthAndSafetyOptions = [];

@Component({
  selector: 'app-site-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
  ],
  templateUrl: './site-settings.component.html',
  styleUrl: './site-settings.component.css',
})
export class SiteSettingsComponent {
  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      selected: node.selected,
    };
  };

  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = environmentalServicesOptions;
  }

  hasChild = (_: number, node: any) => node.expandable;
}
