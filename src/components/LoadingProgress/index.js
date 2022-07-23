import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const styleLoadingProgress = {
    position: "fixed",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: "9999",
    height: "100vh",
    width: "100vw",
    display: "flex",
    background: "rgba(145, 154, 150, 0.3)",
    backdropFilter: "blur(4px)",
    justifyContent: "center",
    alignItems: "center",
};

export default function LoadingProgress() {
    return (
        <Box sx={styleLoadingProgress}>
            <CircularProgress />
        </Box>
    );
}