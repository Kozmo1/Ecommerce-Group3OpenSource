import { config, Config } from "../config/config";
import axios from "axios";

export interface Dependencies {
	config: Config;
	httpClient: typeof axios;
}

const dependencies: Dependencies = {
	config,
	httpClient: axios,
};

export default dependencies;
