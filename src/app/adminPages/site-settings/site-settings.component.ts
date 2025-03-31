import { Component } from '@angular/core';
import {
  MatTreeModule,
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { AddChildDialog } from '../../components/add-child-dialog/add-child-dialog.component';
import { OptionsTreeComponent } from "../../components/options-tree/options-tree.component";

const clientEnvironmentalServicesOptions = [
  {
    name: 'Environmental Facility Compliance',
    selected: false,
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
    selected: false,
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
    selected: false,
    children: [
      { name: 'Soil and Groundwater Sampling', selected: false },
      { name: 'Contamination Delineation', selected: false },
      { name: 'Waste Profiling', selected: false },
      { name: 'Beneficial Reuse Determination', selected: false },
    ],
  },
  {
    name: 'Hazardous Building Materials Surveys',
    selected: false,
    children: [
      { name: 'Asbestos', selected: false },
      { name: 'Lead', selected: false },
      { name: 'Mold', selected: false },
    ],
  },
];

const clientHealthServicesOptions = [
  {
    "name": "Safety Facility Compliance",
    "selected": false,
    "children": [
      { "name": "Infectious Disease Preparedness and Response Plans", "selected": false },
      { "name": "Water Management Plans - Lead, Legionella", "selected": false },
      { "name": "OSHA Compliance Programs", "selected": false },
      { "name": "Job Hazard / Safety Analyses (JHAs/JSAs)", "selected": false },
      { "name": "OSHA / Risk Audits and Assessments", "selected": false },
      { "name": "Personal Protective Equipment", "selected": false },
      { "name": "Confined Space", "selected": false },
      { "name": "Machine Guarding", "selected": false },
      { "name": "Electrical Safety and Lockout/Tagout (LOTO)", "selected": false },
      { "name": "Radiation Safety", "selected": false },
      { "name": "Life and Fire Safety", "selected": false },
      { "name": "Ergonomics", "selected": false },
      { "name": "OSHA / Health & Safety Training", "selected": false },
      { "name": "Health & Safety Program Outsourcing", "selected": false },
      { "name": "Agency Interface / Negotiation", "selected": false },
      { "name": "Cal-OSHA Expertise", "selected": false }
    ]
  },
  {
    "name": "Industrial Hygiene",
    "selected": false,
    "children": [
      { "name": "Industrial Hygiene Assessments", "selected": false },
      { "name": "Ventilation Assessments / Controls", "selected": false },
      { "name": "Indoor Air Quality", "selected": false },
      { "name": "Noise Assessments / Controls", "selected": false },
      { "name": "Asbestos, Lead & Mold Assessments, Management and Abatement", "selected": false }
    ]
  },
  {
    "name": "Construction Safety",
    "selected": false,
    "children": [
      { "name": "Company / Site-Specific Health & Safety Plans", "selected": false },
      { "name": "On-Site Quality Control and Safety", "selected": false }
    ]
  }
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
    OptionsTreeComponent
  ],
  templateUrl: './site-settings.component.html',
  styleUrl: './site-settings.component.css',
})
export class SiteSettingsComponent {
  activeTab = 'consultant'; 

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
    (node: any, level: number) => ({
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      selected: node.selected,
    }),
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  // Create separate data sources for environmental and health options
  dataSourceEnvironmental = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  dataSourceHealth = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(  
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    // Set environmental and health service options separately
    this.dataSourceEnvironmental.data = clientEnvironmentalServicesOptions;
    this.dataSourceHealth.data = clientHealthServicesOptions;
  }

  openAddChildDialog(node: any): void {
    const dialogRef = this.dialog.open(AddChildDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addChild(node, result);
      }
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }
  

  addChild(node: any, childName: string) {
    const newNode = { name: childName, selected: false };
    if (!node.children) {
      node.children = [];
      node.expandable = true;
    }
    node.children.push(newNode);
    this.dataSourceEnvironmental.data = [...this.dataSourceEnvironmental.data];
    this.dataSourceHealth.data = [...this.dataSourceHealth.data];
    this.cdr.detectChanges();
  }

  hasChild = (_: number, node: any) => node.expandable;
}
