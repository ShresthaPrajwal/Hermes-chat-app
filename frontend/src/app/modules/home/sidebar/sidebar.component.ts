import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  public chatRooms = [
    { name: 'General Chat' },
    { name: 'Angular' },
    { name: 'World Chat' }
  ]
  filteredChatRooms = [...this.chatRooms];
  public searchQuery: string = '';


  constructor(){}
  ngOnInit(): void {
    
  }

  public selectRoom(room: any): void{
    console.log('Selected Room', room);
  }

}
