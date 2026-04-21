import { Router, type IRouter } from "express";
import healthRouter from "./health";
import heroSlidesRouter from "./heroSlides";
import servicesRouter from "./services";
import projectsRouter from "./projects";
import eventsRouter from "./events";
import commerceRouter from "./commerce";
import teamRouter from "./team";
import blogRouter from "./blog";
import partnersRouter from "./partners";
import testimonialsRouter from "./testimonials";
import quotesRouter from "./quotes";
import contactRouter from "./contact";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(heroSlidesRouter);
router.use(servicesRouter);
router.use(projectsRouter);
router.use(eventsRouter);
router.use(commerceRouter);
router.use(teamRouter);
router.use(blogRouter);
router.use(partnersRouter);
router.use(testimonialsRouter);
router.use(quotesRouter);
router.use(contactRouter);
router.use(statsRouter);

export default router;
