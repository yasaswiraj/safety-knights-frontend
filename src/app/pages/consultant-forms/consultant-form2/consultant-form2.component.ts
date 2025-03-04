// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';

// @Component({
//   selector: 'app-consultant-form2',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, 
//     MatInputModule,MatSelectModule ],
//   templateUrl: './consultant-form2.component.html',
//   styleUrls: ['./consultant-form2.component.css']
// })
// export class ConsultantForm2Component {
  
//   // Reactive form
//   signUpForm1: FormGroup;

//   // Dropdown options
//   complianceOptions = [
//     'ISO Certification',
//     'Air Emission Permitting',
//     'Waste Management',
//     'Chemical Bulk Storage'
//   ];

//   // Expertise options
//   expertiseOptions = [
//     'ISO 14001 Auditing',
//     'Air Emission Permitting',
//     'Chemical Bulk Storage',
//     'Environmental Training'
//   ];

//   // Selected checkboxes
//   selectedExpertise: string[] = [];

//   // File upload list
//   uploadedFiles: { name: string; file: File }[] = []; // Updated to store file details

//   constructor(private fb: FormBuilder,private router: Router) {
//     // Initialize the form with controls
//     this.signUpForm1 = this.fb.group({
//       compliance: ['', Validators.required], // Dropdown selection
//       otherExpertise: [''],                  // "Other" expertise field
//       files: [[]]                            // Uploaded files array
//     });
//   }

  

  
//   /**
//    * Handle checkbox selection for expertise options.
//    */
//   onCheckboxChange(event: any) {
//     const value = event.target.value;

//     if (event.target.checked) {
//       this.selectedExpertise.push(value);
//     } else {
//       const index = this.selectedExpertise.indexOf(value);
//       if (index > -1) this.selectedExpertise.splice(index, 1);
//     }

//     console.log('Selected Expertise:', this.selectedExpertise);
//   }

//   /**
//    * Add a new file input dynamically.
//    */
//   addFileInput() {
//     this.uploadedFiles.push({ name: '', file: null as any }); // Add a placeholder for a new file
//     console.log('Added new file input:', this.uploadedFiles);
//   }

//   /**
//    * Handle file selection and store it in the uploadedFiles array.
//    */
//   onFileSelect(event: any, index: number) {
//     const file = event.target.files[0];
//     if (file) {
//       this.uploadedFiles[index] = { name: file.name, file }; // Store file details (name and actual file)
//       console.log('Uploaded Files:', this.uploadedFiles);
      
//       // Update the form control with the uploaded files
//       const filesArray = this.uploadedFiles.map(fileData => fileData.file);
//       this.signUpForm1.patchValue({ files: filesArray });
//     }
//   }

//   navigateToNextForm() {
//     if (this.signUpForm1.valid) {
//       console.log('Navigating to Consultant-Form2');
//       this.router.navigate(['/consultant-form1']); // Ensure this matches your routing configuration
//     } else {
//       alert('Please fill in all required fields correctly.');
//     }
//   }


//   /**
//    * Handle form submission.
//    */
//   onSubmit() {
//     if (this.signUpForm1.valid) {
//       const formData = {
//         ...this.signUpForm1.value,
//         selectedExpertise: this.selectedExpertise,
//         uploadedFiles: this.uploadedFiles.map(fileData => fileData.name) // Include only file names in submission
//       };
//       console.log('Form Submitted:', formData);
//       this.router.navigate(['/consultant-form1']);
//     } else {
//       console.log('Form is invalid');
//     }
//   }

// }


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-form3',
  templateUrl: './consultant-form2.component.html',
  styleUrls: ['./consultant-form2.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Ensures custom styles apply correctly
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, // 
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ]
})
export class ConsultantForm2Component{
  signUpForm1: FormGroup;
  services = ['ISO 14001 Auditing', 'Air Emission Permitting', 'Chemical Bulk Storage', 'Environmental Training'];
  uploadedFile: File | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signUpForm1 = this.fb.group({
      scopeOfService: [[], Validators.required], 
      jobDescription: ['', Validators.required],
      location: ['', Validators.required],
      deadline: ['', Validators.required] // 
    });
  }

 //  Navigate to Next Form
  navigateToNextForm() {
    console.log("Button Clicked!");
    this.router.navigate(['/consultant-form3']);
    if (this.signUpForm1.valid) {
      console.log('Form is valid, navigating to consultant-form3');
      
    }else {
      console.log('Form is invalid, check fields:', this.signUpForm1.value);
      // alert('Please fill in all required fields.');
    }
  }

  // navigateToNextForm() {
  //   if (this.signUpForm1.valid) {
  //     setTimeout(() => {
  //       this.router.navigate(['/consultant-form3']);
  //     }, 100); // Short delay
  //   }
  // }

  // Navigate back to Landing Page
  navigateToLandingPage() {
    this.router.navigate(['/']);
  }

  //  Handle File Upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }
}
