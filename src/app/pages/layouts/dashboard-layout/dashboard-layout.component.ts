import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { SIDEBAR_ITEMS, SidebarItem } from '../../../shared/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit {

  sidebarItems: SidebarItem[] = SIDEBAR_ITEMS;
  visibleItems: SidebarItem[] = [];

  collapsed = false;
  hoveredItem: string | null = null;
  profileMenuOpen = false;

  currentUserRole: string = 'superadmin';
  userName: string = 'Admin User';
  avatarUrl: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      this.currentUserRole = storedRole;
    }

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userName = storedName;
    }

    const storedAvatar = localStorage.getItem('avatarUrl');
    if (storedAvatar) {
      this.avatarUrl = storedAvatar;
    }

    this.filterByRole();
    this.applyResponsiveCollapse(window.innerWidth);

    // Auto-open the parent menu that matches the active route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.syncOpenStateWithRoute();
      }
    });
    this.syncOpenStateWithRoute();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.applyResponsiveCollapse(event.target.innerWidth);
  }

  private applyResponsiveCollapse(width: number): void {
    // Auto-collapse on tablet and below; user can still toggle manually afterwards
    if (width <= 1024) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
    }
  }

  private filterByRole(): void {
    this.visibleItems = this.sidebarItems.filter(item => this.roleMatches(item.allowedRole));
  }

  private roleMatches(allowedRole: string | string[]): boolean {
    if (Array.isArray(allowedRole)) {
      return allowedRole.includes(this.currentUserRole);
    }
    return allowedRole === this.currentUserRole;
  }

  private syncOpenStateWithRoute(): void {
    const currentUrl = this.router.url;
    this.visibleItems.forEach(item => {
      if (item.children?.length) {
        const hasActiveChild = item.children.some(child => child.route && currentUrl.startsWith(child.route));
        item.open = hasActiveChild;
      }
    });
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      this.hoveredItem = null;
    }
  }

  toggleSubmenu(item: SidebarItem): void {
    if (!item.children?.length) return;
    item.open = !item.open;
  }

  onHoverItem(label: string): void {
    this.hoveredItem = label;
  }

  onLeaveItem(): void {
    this.hoveredItem = null;
  }

  isParentActive(item: SidebarItem): boolean {
    if (!item.children?.length) return false;
    const currentUrl = this.router.url;
    return item.children.some(child => child.route && currentUrl.startsWith(child.route));
  }

  get userInitials(): string {
    if (!this.userName) return 'A';
    const parts = this.userName.trim().split(' ');
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  goToProfile(): void {
    this.closeProfileMenu();
    this.router.navigate(['/superadmin/profile']);
  }

  logout(): void {
    this.closeProfileMenu();
    localStorage.clear();
    this.router.navigate(['/auth/sign-in']);
  }
}