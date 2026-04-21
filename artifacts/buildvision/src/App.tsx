import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { PublicLayout } from "@/components/layout/PublicLayout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Events from "@/pages/Events";
import Commerce from "@/pages/Commerce";
import Team from "@/pages/Team";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Partners from "@/pages/Partners";
import Contact from "@/pages/Contact";
import Quote from "@/pages/Quote";

import { AdminLayout } from "@/components/layout/AdminLayout";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminHeroSlider from "@/pages/admin/HeroSlider";
import AdminProjects from "@/pages/admin/Projects";
import AdminServices from "@/pages/admin/Services";
import AdminTeam from "@/pages/admin/Team";
import AdminEvents from "@/pages/admin/Events";
import AdminCommerce from "@/pages/admin/Commerce";
import AdminBlog from "@/pages/admin/Blog";
import AdminPartners from "@/pages/admin/Partners";
import AdminTestimonials from "@/pages/admin/Testimonials";
import AdminQuotes from "@/pages/admin/Quotes";
import AdminContact from "@/pages/admin/Contact";
import AdminCompanyInfo from "@/pages/admin/CompanyInfo";

const queryClient = new QueryClient();

function PublicRoutes() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/a-propos" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/services/:slug" component={ServiceDetail} />
        <Route path="/projets" component={Projects} />
        <Route path="/projets/:id" component={ProjectDetail} />
        <Route path="/evenementiel" component={Events} />
        <Route path="/commerce" component={Commerce} />
        <Route path="/equipe" component={Team} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/partenaires" component={Partners} />
        <Route path="/contact" component={Contact} />
        <Route path="/devis" component={Quote} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/hero" component={AdminHeroSlider} />
        <Route path="/admin/projects" component={AdminProjects} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/team" component={AdminTeam} />
        <Route path="/admin/events" component={AdminEvents} />
        <Route path="/admin/commerce" component={AdminCommerce} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/partners" component={AdminPartners} />
        <Route path="/admin/testimonials" component={AdminTestimonials} />
        <Route path="/admin/quotes" component={AdminQuotes} />
        <Route path="/admin/contact" component={AdminContact} />
        <Route path="/admin/company" component={AdminCompanyInfo} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/:rest*" component={AdminRoutes} />
      <Route component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
