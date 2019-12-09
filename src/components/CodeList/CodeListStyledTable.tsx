import * as React from "react";
import {
    SORT_DIRECTION,
    SortableHeadCell,
    StyledBody,
    StyledCell,
    StyledHead,
    StyledHeadCell,
    StyledRow,
    StyledTable
} from "baseui/table";
import {useStyletron, withStyle} from "baseui";
import {Policy, Process} from "../../constants";
import {Code, codelist} from "../../service/Codelist";
import {Block} from "baseui/block";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import UpdateCodeListModal from "./ModalUpdateCodeList";
import {intl} from "../../util";
import DeleteCodeListModal from "./ModalDeleteCodeList";
import axios from "axios";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;


const SmallerHeadCell = withStyle(StyledHeadCell, {
    maxWidth: "15%",
    wordBreak: "break-word",
});

const SmallCell = withStyle(StyledCell, {
    maxWidth: "15%",
    wordBreak: "break-word",
});

const headerStyle = {
    paddingTop: "2px",
    paddingRight: "16px",
    paddingBottom:"2px",
    paddingLeft:"0",
};

type TableCodelistProps = {
    selectedCodelist: string,
    tableData: Code[],
    hasAccess: boolean
};

const CodeListTable = ({ selectedCodelist, tableData, hasAccess }: TableCodelistProps) => {
    const [useCss] = useStyletron();

    const [rows, setRows] = React.useState()
    const [selectedRow, setSelectedRow] = React.useState();
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [errorOnResponse, setErrorOnResponse] = React.useState(null);

    const [codeDirection, setCodeDirection] = React.useState<any>(null);
    const [shortNameDirection, setShortNameDirection] = React.useState<any>(null);
    const [descriptionDirection, setDescriptionDirection] = React.useState<any>(null);

    const makeTableRow = (codeList: Code) => {
        return [
            codeList.code,
            codeList.shortName,
            codeList.description,
            (hasAccess && <Block display="flex" justifyContent="flex-end" width="100%">
                <Button
                    size={ButtonSize.compact}
                    kind={KIND.tertiary}
                    onClick={
                        () => {
                            setSelectedRow(codeList);
                            setShowEditModal(true)
                        }
                    }
                >
                    <FontAwesomeIcon icon={faEdit}/>
                </Button>
                <Button
                    size={ButtonSize.compact}
                    kind={KIND.tertiary}
                    onClick={
                        () => {
                            setSelectedRow(codeList);
                            setShowDeleteModal(true)
                        }
                    }
                >
                    <FontAwesomeIcon icon={faTrash}/>
                </Button>
            </Block>)
        ];
    };

    const handleEditCodelist = async (values: any) => {
        let body = [{
            ...values,
        }];
        await axios
            .put(`${server_polly}/codelist`, body)
            .then(((res: any) => {
                let newRow = makeTableRow(res.data[0])
                setRows([...rows.filter((row: any) => row[0] !== res.data[0].code), newRow])
                setShowEditModal(false)
                codelist.refreshCodeLists()
            }))
            .catch((error: any) => {
                setShowEditModal(true);
                setErrorOnResponse(error.message);
            });
    };

    const handleDeleteCodelist = async (values: { list: string, code: string}) => {
        await axios
            .delete(`${server_polly}/codelist/${values.list}/${values.code}`)
            .then(((res: any) => {
                codelist.refreshCodeLists();
                setRows(rows.filter((row: any) => row[0] !== values.code))
                setShowDeleteModal(false);
            }))
            .catch((error: any) => {
                setShowDeleteModal(true);
                setErrorOnResponse(error.message);
            });
    };

    const handleSort = (title: string, prevDirection: string) => {
        let nextDirection = null;
        if (prevDirection === SORT_DIRECTION.ASC) {
            nextDirection = SORT_DIRECTION.DESC;
        }
        if (prevDirection === SORT_DIRECTION.DESC) {
            nextDirection = null;
        }
        if (prevDirection === null) {
            nextDirection = SORT_DIRECTION.ASC;
        }
        if (title === "Code") {
            setCodeDirection(nextDirection);
            setShortNameDirection(null);
            setDescriptionDirection(null);
            return;
        }
        if (title === "Short Name") {
            setCodeDirection(null);
            setShortNameDirection(nextDirection);
            setDescriptionDirection(null);
            return;
        }
        if (title === "Description") {
            setCodeDirection(null);
            setShortNameDirection(null);
            setDescriptionDirection(nextDirection);
            return;
        }
    };

    const getSortedData = (tableData:any) => {
        if (codeDirection) {
            const sorted = rows.slice(0).sort((a: any, b: any) =>
                a[0].localeCompare(b[0]),
            );
            if (codeDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (codeDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (shortNameDirection) {
            const sorted = rows.slice(0).sort((a: any, b: any) =>
                a[0].localeCompare(b[0]),
            );
            if (shortNameDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (shortNameDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (descriptionDirection) {
            const sorted = rows.slice(0).sort((a: any, b: any) =>
                a[0].localeCompare(b[0]),
            );
            if (descriptionDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (descriptionDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }
        return rows;
    };

    React.useEffect(() => {
        console.log(tableData, "Tabledata")
        setRows(tableData.map(row => makeTableRow(row)))
    }, [tableData]);

    return(
        <React.Fragment>
        <StyledTable className={useCss({overflow: "hidden !important"})}>
            <StyledHead>
                <SmallerHeadCell>
                    <SortableHeadCell
                        overrides={{
                            HeadCell: {
                                style: headerStyle
                            }
                        }}
                        title="Code"
                        direction={codeDirection}
                        onSort={() =>
                            handleSort("Code", codeDirection)
                        }
                    />
                </SmallerHeadCell>
                <SmallerHeadCell>
                    <SortableHeadCell
                        overrides={{
                            HeadCell: {
                                style: headerStyle
                            }
                        }}
                        title="Short Name"
                        direction={shortNameDirection}
                        onSort={() =>
                            handleSort("Short Name", shortNameDirection)
                        }
                    />
                </SmallerHeadCell>
                <StyledHeadCell styled={{
                    maxWidth: "55%",
                    minWidth: "24rem"
                }}>
                    <SortableHeadCell
                        overrides={{
                            HeadCell: {
                                style: headerStyle
                            }
                        }}
                        title="Description"
                        direction={descriptionDirection}
                        onSort={() =>
                            handleSort("Description", descriptionDirection)
                        }
                    />
                </StyledHeadCell>
                <SmallerHeadCell/>
            </StyledHead>
            <StyledBody>
                {rows && getSortedData(rows).map((row: any, index: any) => (
                    <StyledRow key={index}>
                        <SmallCell>{row[0]}</SmallCell>
                        <SmallCell>{row[1]}</SmallCell>
                        <StyledCell
                            styled={{
                                maxWidth: "55%",
                                minWidth: "24rem",
                            }}
                        >
                            {row[2]}
                        </StyledCell>
                        <SmallCell>{row[3]}</SmallCell>
                    </StyledRow>
                ))}
            </StyledBody>

            {showEditModal && (
                <UpdateCodeListModal
                    title={intl.editCodeListTitle}
                    list={selectedRow ? selectedRow.list : ""}
                    code={selectedRow ? selectedRow.code : ""}
                    shortName={selectedRow ? selectedRow.shortName : ""}
                    description={selectedRow ? selectedRow.description : ""}
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(!showEditModal);
                        setErrorOnResponse(null);
                    }}
                    errorOnUpdate={errorOnResponse}
                    submit={handleEditCodelist}
                />

            )}
            {showDeleteModal && (
                <DeleteCodeListModal
                    title={intl.deleteCodeListConfirmationTitle}
                    list={selectedRow ? selectedRow.list : ""}
                    code={selectedRow ? selectedRow.code : ""}
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(!showDeleteModal);
                        setErrorOnResponse(null);
                    }}
                    errorOnDelete={errorOnResponse}
                    submit={handleDeleteCodelist}
                />
            )}
        </StyledTable>
        </React.Fragment>
    );
};

export default CodeListTable;