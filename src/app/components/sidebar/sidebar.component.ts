import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {IndexComponent} from '../index/index.component';
import * as XLSX from 'xlsx';
import {SESSION_STORAGE, StorageService} from 'ngx-webstorage-service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
  @ViewChild(IndexComponent) index!: IndexComponent;
  
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  public checked:any= [
    {name:"Title", value:null},
    {name:"Subtitle", value:null},
    {name:"Isbn13", value:null},
    {name:"Price", value:null},
    {name:"URL", value:null}
  ];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.checked.forEach((element: any) => {
      element.value = this.storage.get(element.name);
    });
  }

  saveInLocal(): void {
    //console.log('recieved= key:' + key + 'value:' + val);
    this.checked.forEach((element: any) => {
      this.storage.set(element.name, element.value);
      console.log(element.name);
    });
    
    //this.data[key]= this.storage.get(key);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit (){
    
  }

  showOptions(event:any, position:any, name:any): void{
    console.log(this.checked[position])
    this.checked[position].value = this.checked[position].value ? false : true;
    this.index.columns[position].hide = this.checked[position].value;
  }

  exportAsExcel(){
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.index.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'ExportTable.xlsx');
  }
}
