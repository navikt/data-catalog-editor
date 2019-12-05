import axios from "axios";
import { SensitivityLevel } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

// TODO show error
class CodelistService {
    lists: AllCodelists | null = null;
    error: string | null = null;
    promise: Promise<any>;

    constructor() {
        this.promise = this.fetchData();
    }

    private fetchData = async () => {
        return axios
            .get(`${server_polly}/codelist`)
            .then(this.handleGetCodelistResponse)
            .catch(err => (this.error = err.message));
    };

    handleGetCodelistResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            this.lists = response.data;
        } else {
            this.error = response.data;
        }
    };

    getCodes(list: ListName): Code[] {
        return this.lists && this.lists.codelist[list] ? this.lists.codelist[list].sort((c1, c2) => c1.shortName.localeCompare(c2.shortName)) : [];
    }

    getCode(list: ListName, codeName: string): Code | undefined {
        return this.getCodes(list).find(c => c.code === codeName);
    }

    getShortname(list: ListName, codeName: string) {
        let code = this.getCode(list, codeName);
        return code ? code.shortName : codeName;
    }

    getShortnames(list: ListName, codeNames: string[]) {
        return codeNames.map(codeName => this.getShortname(list, codeName))
    }

    getDescription(list: ListName, codeName: string) {
        let code = this.getCode(list, codeName);
        return code ? code.description : codeName;
    }

    getParsedOptions(listName: ListName) {
        return this.getCodes(listName).map((code: Code) => {
            return { id: code.code, label: code.shortName };
        });
    }

    requiresNationalLaw(gdprCode?: string) {
        return gdprCode && this.nationalLawArticles().indexOf(gdprCode) >= 0
    }

    nationalLawArticles() {
        return ['ART61C', 'ART61E']
    }

    requiresDescription(gdprCode?: string) {
        return gdprCode && this.descriptionArticles().indexOf(gdprCode) >= 0
    }

    descriptionArticles() {
        return ['ART61C', 'ART61E', 'ART61F']
    }

    requiresArt9(sensitivityCode?: string) {
        return sensitivityCode === SensitivityLevel.ART9
    }

    isArt9(gdprCode?: string) {
        return gdprCode && gdprCode.startsWith('ART9')
    }

    async wait() {
        await this.promise;
    }

    isLoaded() {
        return this.lists !== null || this.error !== null;
    }
}

export enum ListName {
    PURPOSE = "PURPOSE",
    CATEGORY = "CATEGORY",
    SOURCE = "SOURCE",
    SENSITIVITY = "SENSITIVITY",
    NATIONAL_LAW = "NATIONAL_LAW",
    SUBJECT_CATEGORY = "SUBJECT_CATEGORY",
    GDPR_ARTICLE = "GDPR_ARTICLE",
    DEPARTMENT = "DEPARTMENT",
    SUB_DEPARTMENT = "SUB_DEPARTMENT",
    SYSTEM = "SYSTEM"
}

export const codelist = new CodelistService();

// new objects from /codelist

export interface AllCodelists {
    codelist: List;
}

export interface List {
    [name: string]: Code[];
}

export interface Code {
    list: ListName;
    code: string;
    shortName: string;
    description: string;
    invalidCode?: boolean;
}
