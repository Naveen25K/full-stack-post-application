import express from "express";
import { config } from "./config/index.js";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
})

// typescript
// frontend
// send notification in email
// in post, add media
// download reports via background job and send report in email
// reply in comments


// currently all posts fetched from db
// optimization in fetching posts
    // 1. indexing in db
    // 2. put posts data on caching