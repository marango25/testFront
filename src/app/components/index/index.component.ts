import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ItbookService } from '../../services/itbook.service'
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SESSION_STORAGE, StorageService} from 'ngx-webstorage-service';
import 'hammerjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})


export class IndexComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild('table') public table!: ElementRef;

  public value = "Mongo";
  public page = "1";
  public disabled:boolean = false;

  columns: any[] = [
    { name: 'title', title: 'Title', hide: false, propierty:null },
    { name: 'subtitle', title: 'Subtitle', hide: false, propierty:null },
    { name: 'isbn13', title: 'Isbn13', hide: false, propierty:null },
    { name: 'price', title: 'Price', hide: false, propierty:null },
    { name: 'url', title: 'URL', hide: false, propierty:null }
  ];

  data:any[] = [];
  displayedColumns: string[] = [ "title", "subtitle", "isbn13", "price", "url"];
  dataSource = new MatTableDataSource<any[]>();
  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent;

  public previousIndex: number = 0;

  constructor(private BookService:ItbookService, 
              private _snackBar: MatSnackBar, 
              @Inject(SESSION_STORAGE) private storage: StorageService,
              public dialog: MatDialog) {}

  openDialog(position: number) {
    const data = this.data[position];
    const dialogRef = this.dialog.open(DialogComponent, {
      data:{
        title:data.title,
        subtitle:data.subtitle,
        isbn13:data.isbn13,
        price:data.price,
        url:data.url,
        image:data.image
      }
    });
  }

  getDisplayedColumns():string[] {
    return this.columns.filter(cd=>!cd.hide).map(cd=>cd.name);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.columns.map((value:any, index:any)=>{
      value.hide = this.storage.get(value.title) ;   
    });
    this.searchByName();
  }

  tableDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  onKeyUpEvent(event: any){
    console.log(event.target.value);
    this.disabled = event.target.value.length > 0 ? true : false;
  }

  searchByName(){
    console.log(this.value)
    this.BookService.searchByName(this.value, this.page).subscribe((res) =>{
      console.log(res.body)
      if(res.body.total == 0){
        this.openSnackBar("No exist books whit that name!","UNDO");
      }
      this.dataSource.data = res.body.books;
      this.data = res.body.books;
    });
  }

  public doFilter = (value: any) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}

