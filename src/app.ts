import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import path from "path";
import appRoutes from "./routes/app.route";
import adminRoutes from "./routes/admin.route";
import areaRoutes from "./routes/area.route";
import contactRoutes from "./routes/contact.route";
import bannerRoutes from "./routes/banner.route";
import patientRoutes from "./routes/patient.route";
import membershipRoutes from "./routes/membership.route";
import { db, store } from "./config/index"; 
import AppError from "./utils/appError";


dotenv.config();
const app: Application = express();
app.use("/assets", express.static(path.join(__dirname, "./assets")));


const corsOptions = {
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "https://gibarestorative.com", 
  ],
  credentials: true,
};


app.use(cors(corsOptions));  
app.options('*', cors(corsOptions));  


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Session configuration
app.use(session({
  secret: process.env.SECRET_KEY!,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// Routes
app.use("/api/v1", appRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/area", areaRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/members', membershipRoutes);

// Error handling for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`The route ${req.originalUrl} with the ${req.method} method does not exist on this server! 💨`, 404));
});

// Global error handler
app.use((err: AppError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


db.once("open", () => {
  console.log("Connected to MongoDB");

  const PORT: number | string = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

db.on("error", console.error.bind(console, "MongoDB Connection Error:"));

export default app;
