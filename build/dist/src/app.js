"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const app_route_1 = __importDefault(require("./routes/app.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const area_route_1 = __importDefault(require("./routes/area.route"));
const contact_route_1 = __importDefault(require("./routes/contact.route"));
const banner_route_1 = __importDefault(require("./routes/banner.route"));
const patient_route_1 = __importDefault(require("./routes/patient.route"));
const membership_route_1 = __importDefault(require("./routes/membership.route"));
const mailingList_route_1 = __importDefault(require("./routes/mailingList.route"));
const index_1 = require("./config/index");
const appError_1 = __importDefault(require("./utils/appError"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "./assets")));
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://gibarestorative.com",
        "https://www.gibarestorative.com",
    ],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: index_1.store,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));
// Routes
app.use("/api/v1", app_route_1.default);
app.use("/api/v1/admin", admin_route_1.default);
app.use("/api/v1/area", area_route_1.default);
app.use('/api/v1/contact', contact_route_1.default);
app.use('/api/v1/banners', banner_route_1.default);
app.use('/api/v1/patients', patient_route_1.default);
app.use('/api/v1/members', membership_route_1.default);
app.use("/api/v1/mailinglist", mailingList_route_1.default);
// Error handling for undefined routes
app.all("*", (req, res, next) => {
    next(new appError_1.default(`The route ${req.originalUrl} with the ${req.method} method does not exist on this server! 💨`, 404));
});
// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(Object.assign({ status: "error", message: err.message }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
});
index_1.db.once("open", () => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
index_1.db.on("error", console.error.bind(console, "MongoDB Connection Error:"));
exports.default = app;
