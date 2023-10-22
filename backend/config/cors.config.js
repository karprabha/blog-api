const corsConfig = {
    origin: [process.env.CLIENT_URI, process.env.CMS_URI],
    methods: "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
};

export default corsConfig;
