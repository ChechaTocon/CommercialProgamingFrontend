import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '../../../models/review.model'

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dialog
  ) { }

  ngOnInit(): void {
  }

  clickNo(): void {
    this.dialogRef.close()
  }

}
