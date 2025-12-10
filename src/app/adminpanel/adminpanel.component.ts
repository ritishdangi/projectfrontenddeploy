import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { ClientService } from '../services/client.service';
import { ContactService } from '../services/contact.service';
import { NewsletterService } from '../services/newsletter.service';

@Component({
  selector: 'app-adminpanel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent {

  constructor(
    private projectService: ProjectService,
    private clientService: ClientService,
    private contactService: ContactService,
    private newsletterService: NewsletterService
  ) {}

  sidebarItems = [
    { id: 'dashboard-section', title: 'Dashboard', icon: '🏠' },
    { id: 'projects-section', title: 'Projects', icon: '📁' },
    { id: 'clients-section', title: 'Clients', icon: '👥' },
    { id: 'contacts-section', title: 'Contact Forms', icon: '📨' },
    { id: 'subscribers-section', title: 'Subscribers', icon: '📰' }
  ];

  activeSection: string = 'dashboard-section';
  topbarTitle: string = 'Dashboard';

  dashboardStats = [
    { title: 'Total Projects', value: 0, hint: 'Active projects on landing page' },
    { title: 'Total Clients', value: 0, hint: 'Happy clients featured' },
    { title: 'Contact Submissions', value: 0, hint: 'Consultation form entries' },
    { title: 'Subscribers', value: 0, hint: 'Newsletter email list' }
  ];

  projects: any[] = [];
  clients: any[] = [];
  contacts: any[] = [];
  subscribers: any[] = [];

  modals = { project: false, client: false };

  projectImageFile: File | null = null;

  projectFormData = {
    name: "",
    description: ""
  };

  clientImageFile: File | null = null;

  clientFormData = {
    name: "",
    designation: "",
    description: ""
  };

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    this.loadProjects();
    this.loadClients();
    this.loadContacts();
    this.loadSubscribers();
  }

  loadProjects() {
    this.projectService.getAllProjects(0, 100).subscribe(res => {
      this.projects = res.content || res;
      this.dashboardStats[0].value = this.projects.length;
    });
  }

  loadClients() {
    this.clientService.getAllClients(0, 100).subscribe(res => {
      this.clients = res.content || res;
      this.dashboardStats[1].value = this.clients.length;
    });
  }

  loadContacts() {
    this.contactService.getAllContacts(0, 200).subscribe(res => {
      this.contacts = res.content || res;
      this.dashboardStats[2].value = this.contacts.length;
    });
  }

  loadSubscribers() {
  this.newsletterService.getAllSubscribers(0, 200).subscribe(res => {

    let list = res.content || res;

    this.subscribers = list.map((s: any) => ({
      ...s,
      subscribedAt: s.subscribedAt || new Date().toLocaleString()
    }));

    this.dashboardStats[3].value = this.subscribers.length;
  });
}


  deleteProject(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    this.projectService.deleteProject(id).subscribe({
      next: () => {
        alert("Project deleted successfully!");
        this.projects = this.projects.filter(p => p.id !== id);
        this.dashboardStats[0].value = this.projects.length;
      },
      error: (err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete project");
      }
    });
  }

  onProjectImageSelected(event: any) {
    this.projectImageFile = event.target.files[0];
  }

  saveProject() {
    if (!this.projectFormData.name || !this.projectFormData.description) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();

    if (this.projectImageFile) formData.append("image", this.projectImageFile);

    formData.append("name", this.projectFormData.name);
    formData.append("description", this.projectFormData.description);

    this.projectService.createProject(formData).subscribe({
      next: () => {
        alert("Project added successfully!");

        this.closeModal('project');

        this.projectFormData = { name: "", description: "" };
        this.projectImageFile = null;

        this.loadProjects();
      },
      error: (err) => {
        console.error("Project save error:", err);
        alert("Failed to save project");
      }
    });
  }

  onClientImageSelected(event: any) {
    this.clientImageFile = event.target.files[0];
  }

  saveClient() {
    if (!this.clientFormData.name || !this.clientFormData.designation || !this.clientFormData.description) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();

    if (this.clientImageFile) formData.append("image", this.clientImageFile);

    formData.append("name", this.clientFormData.name);
    formData.append("designation", this.clientFormData.designation);
    formData.append("description", this.clientFormData.description);

    this.clientService.createClient(formData).subscribe({
      next: () => {
        alert("Client added successfully!");

        this.closeModal('client');

        this.clientFormData = { name: "", designation: "", description: "" };
        this.clientImageFile = null;

        this.loadClients();
      },
      error: (err) => {
        console.error("Client save error:", err);
        alert("Failed to save client");
      }
    });
  }
  deleteClient(id: number) {
  if (!confirm("Are you sure you want to delete this client?")) return;

  this.clientService.deleteClient(id).subscribe({
    next: () => {
      alert("Client deleted successfully!");

      this.clients = this.clients.filter(c => c.id !== id);

      this.dashboardStats[1].value = this.clients.length;
    },
    error: (err) => {
      console.error("Client delete error:", err);
      alert("Failed to delete client");
    }
  });
}

  switchSection(sectionId: string, title: string) {
    this.activeSection = sectionId;
    this.topbarTitle = title;
  }
  openModal(name: 'project' | 'client') {
    this.modals[name] = true;
  }

  closeModal(name?: 'project' | 'client') {
    if (name) this.modals[name] = false;
    else this.modals = { project: false, client: false };
  }

  overlayClose(event: Event, modalName: 'project' | 'client') {
    if ((event.target as HTMLElement).classList.contains('modal__overlay')) {
      this.closeModal(modalName);
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.closeModal();
  }
}
