import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { ClientService } from '../services/client.service';
import { ContactService } from '../services/contact.service';
import { NewsletterService } from '../services/newsletter.service';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent implements OnInit, AfterViewInit {

  constructor(private projectService: ProjectService,
    private clientService: ClientService,
     private contactService: ContactService,
     private newsletterService: NewsletterService
  ) {}

  // NAVBAR LINKS (Dynamic)
  navLinks = [
    { label: "Home", href: "#top" },
    { label: "Services", href: "#about" },
    { label: "Projects", href: "#project" },
    { label: "Testimonials", href: "#clients" },
  ];

  // WHY CHOOSE US
  whyCards = [
    { icon: "📈", title: "Potential ROI", desc: "Highlight the numbers that matter – leads captured, viewings booked and deals closed." },
    { icon: "🎨", title: "Design", desc: "Pixel-perfect layouts with consistent spacing, colours and typography across the page." },
    { icon: "📣", title: "Marketing", desc: "Optimised sections for testimonials, projects and CTAs to support your marketing goals." }
  ];

  // ABOUT US COLLAGE IMAGES
  aboutImages = [
    { class: 'tall', src: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { class: 'wide', src: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { class: 'medium', src: "https://images.pexels.com/photos/1181615/pexels-photo-1181615.jpeg?auto=compress&cs=tinysrgb&w=1200" }
  ];

  // PROJECTS LOADED FROM BACKEND
  projects: any[] = [];

  // CLIENT TESTIMONIALS
  clients: any[] = [];

  // Newsletter email binding
  newsletterEmail = "";

  contact = {
  fullName: "",
  email: "",
  mobile: "",
  city: ""
};


  // --------------------
  // INIT LOAD
  // --------------------
  ngOnInit(): void {
    this.loadProjects();
    this.loadClients();
  }

  loadProjects() {
    this.projectService.getAllProjects(0, 20).subscribe({
      next: (res: any) => {
        this.projects = res.content || res; // works for paginated or normal list
        console.log("Projects loaded:", this.projects);
      },
      error: (err) => console.error("Error loading projects:", err)
    });
  }
  loadClients() {
  this.clientService.getAllClients(0, 50).subscribe({
    next: (res: any) => {
      this.clients = res.content || res;
      console.log("Loaded Clients:", this.clients);
    },
    error: (err) => console.error("Client Load Error:", err)
  });
}

submitContact() {
  this.contactService.createContact(this.contact).subscribe({
    next: (res) => {
      alert("Your consultation request was submitted successfully!");

      // reset form
      this.contact = {
        fullName: "",
        email: "",
        mobile: "",
        city: ""
      };
    },
    error: (err) => {
      console.error("Submission error:", err);
      alert("Failed to submit. Please try again.");
    }
  });
}

subscribeNewsletter() {
  if (!this.newsletterEmail || this.newsletterEmail.trim() === "") {
    alert("Please enter a valid email address.");
    return;
  }

  // 🔥 Auto-generate timestamp because backend does NOT save it
  const now = new Date().toISOString();   // or new Date().toLocaleString()

  this.newsletterService.subscribe({
    email: this.newsletterEmail,
    subscribedAt: now   // <-- ADD THIS LINE
  }).subscribe({
    next: (res) => {
      alert("Thank you for subscribing!");

      // Reset input
      this.newsletterEmail = "";
    },
    error: (err) => {
      console.error("Newsletter subscribe error:", err);
      alert("Subscription failed. Try again.");
    }
  });
}


  // --------------------
  // ACTIVE NAVBAR LOGIC
  // --------------------
  ngAfterViewInit(): void {

    const navLinks: HTMLAnchorElement[] = Array.from(
      document.querySelectorAll(".nav-links a")
    );

    const setActive = (hash: string) => {
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === hash);
      });
    };

    // click-based active
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        setActive(link.getAttribute("href") || "");
      });
    });

    // auto-home-active near top
    const activateHomeNearTop = () => {
      if (window.scrollY < 120) setActive("#top");
    };
    window.addEventListener("scroll", activateHomeNearTop, { passive: true });
    activateHomeNearTop();

    // scroll-activated navbar using intersection observer
    const sections = navLinks.map(link => {
      const id = (link.getAttribute("href") || "").replace("#", "");
      const section = document.getElementById(id);
      return section ? { id, link, section } : null;
    }).filter(Boolean) as any[];

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      }, {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
      });

      sections.forEach(({ section }) => observer.observe(section));
    }
  }
}
