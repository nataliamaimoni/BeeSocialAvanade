import { Component, OnInit } from '@angular/core';
import { PostService } from '../../post.service';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { EventEmitterService } from '../../event-emitter.service';

@Component({
  selector: 'app-timeline-create-post',
  templateUrl: './timeline-create-post.component.html',
  styleUrls: ['./timeline-create-post.component.scss']
})
export class TimelineCreatePostComponent implements OnInit {

  post: Post = {
    userName: '',
    groupName: '',
    avatarPicture: 'assets/images/avatar2.png',
    description: '',
    pictures: [{
      src: '',
      alt: '',
    }],
    likes: 0
  }

  public value: string = ''
  private file: string = '';

  constructor(
    private insertPostService: PostService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  insertPost() {
    this.insertFields()

    this.insertPostService.addPost(this.post).subscribe(texto => {
      EventEmitterService.get('newPost').emit()
    })
  }

  insertFields() {
    let spanGroupName = document.querySelector("#activeGroup");
    if (spanGroupName !== null) {
      spanGroupName = document.getElementById("activeGroup");
      this.post.groupName = spanGroupName.innerHTML.toString();
    }

    let userName = document.getElementById('username').innerHTML.toString()
    let userPhoto = document.getElementById('userphoto').attributes["src"].value

    console.log(userPhoto)

    this.post.description = this.value
    this.post.userName = userName
    this.post.avatarPicture = userPhoto
  }

  onFileChanged(event) {
    this.file = event.target.files[0]
    console.log(this.file)
  }


  public updateResponse(resp: Event): void {
    this.value = ((<HTMLInputElement>resp.target).value);
  }


}
