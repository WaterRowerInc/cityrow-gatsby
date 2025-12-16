import { withStyles } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { checkIfIsMobile } from "../../../../hooks/useCheckMobile";

const PagingProgressBar = withStyles(() => ({
  root: {
    height: 4,
    width: checkIfIsMobile() ? "100%" : 88,
    flex: checkIfIsMobile() ? 1 : 0,
    borderRadius: 2,
  },
  colorPrimary: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  bar: {
    flexGrow: 1,
    backgroundColor: "white",
    borderRadius: 2,
  },
}))(LinearProgress);

export default PagingProgressBar;
