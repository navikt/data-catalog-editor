import * as React from "react";
import { intl, useAwait } from "../util"
import { RouteComponentProps } from "react-router-dom";
import { codelist, ListName } from "../service/Codelist";
import { Plus } from "baseui/icon";
import { Block, BlockProps } from "baseui/block";
import { createDisclosure, deleteDisclosure, getDisclosuresByRecipient, getInformationTypesBySource, updateDisclosure } from "../api";
import TableDisclosure from "../components/common/TableDisclosure";
import { H5, Label2, Paragraph2 } from "baseui/typography";
import { Button, KIND } from "baseui/button";
import { user } from "../service/User";
import { Disclosure, DisclosureFormValues, InformationType } from "../constants";
import ModalThirdParty from "../components/ThirdParty/ModalThirdPartyForm";
import ListRecievedInformationTypes from "../components/ThirdParty/ListRecievedInformationTypes";
import { StyledSpinnerNext } from "baseui/spinner"

const labelBlockProps: BlockProps = {
  marginBottom: '1rem',
  font: 'font400'
}

export type PathParams = { thirdPartyCode: string }

const ThirdPartyPage = (props: RouteComponentProps<PathParams>) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [disclosureList, setDisclosureList] = React.useState<Disclosure[]>([]);
  const [informationTypeList, setInformationTypeList] = React.useState<InformationType[]>()
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [error, setError] = React.useState<string>();

  const handleCreateDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      let createdDisclosure = await createDisclosure(disclosure)

      if (!disclosureList || disclosureList.length < 1)
        setDisclosureList([createdDisclosure])
      else if (disclosureList && createdDisclosure)
        setDisclosureList([...disclosureList, createdDisclosure])

      setShowCreateModal(false)
    } catch (err) {
      setShowCreateModal(true)
      setError(err.message)
    }
  }

  const handleEditDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      let updatedDisclosure = await updateDisclosure(disclosure)
      setDisclosureList([...disclosureList.filter((d: Disclosure) => d.id !== updatedDisclosure.id), updatedDisclosure])
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }


  const handleDeleteDisclosure = async (disclosure: Disclosure) => {
    if (!disclosure) return false
    try {
      await deleteDisclosure(disclosure.id)
      setDisclosureList([...disclosureList.filter((d: Disclosure) => d.id !== disclosure.id)])
      setError(undefined)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const initialFormValues: DisclosureFormValues = {
    name: '',
    recipient: props.match.params.thirdPartyCode,
    recipientPurpose: '',
    description: '',
    document: undefined,
    legalBases: [],
    legalBasesOpen: false,
    start: undefined,
    end: undefined
  }

  useAwait(user.wait())

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      await codelist.wait();
      if (props.match.params.thirdPartyCode) {
        setDisclosureList(await getDisclosuresByRecipient(props.match.params.thirdPartyCode))
        setInformationTypeList((await getInformationTypesBySource(props.match.params.thirdPartyCode)).content)
      }
      setIsLoading(false);
    })()
  }, []);

  return (
    <React.Fragment>
      {isLoading && <StyledSpinnerNext/>}

      {!isLoading && codelist && (
        <React.Fragment>
          <Block marginBottom="3rem">
            <H5>{codelist.getShortname(ListName.THIRD_PARTY, props.match.params.thirdPartyCode)}</H5>
            <Paragraph2>{codelist.getDescription(ListName.THIRD_PARTY, props.match.params.thirdPartyCode)}</Paragraph2>
          </Block>

          <Block display="flex" justifyContent="space-between">
            <Label2 {...labelBlockProps}>{intl.disclosuresToThirdParty}</Label2>
            {user.canWrite() &&
            <Block>
              <Button
                size="compact"
                kind={KIND.minimal}
                onClick={() => setShowCreateModal(true)}
                startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22}/></Block>}
              >
                {intl.createNew}
              </Button>
              <ModalThirdParty
                title={intl.createThirdPartyModalTitle}
                isOpen={showCreateModal}
                initialValues={initialFormValues}
                submit={handleCreateDisclosure}
                onClose={() => {
                  setShowCreateModal(false)
                  setError(undefined)
                }}
                errorOnCreate={error}
                disableRecipientField={true}
              />
            </Block>
            }
          </Block>
          <React.Fragment>
            <Block marginBottom="3rem">
              <TableDisclosure
                list={disclosureList}
                showRecipient={false}
                errorModal={error}
                editable
                submitDeleteDisclosure={handleDeleteDisclosure}
                submitEditDisclosure={handleEditDisclosure}
                onCloseModal={() => setError(undefined)}
              />
            </Block>
          </React.Fragment>


          <Block marginBottom="3rem">
            <ListRecievedInformationTypes informationtypeList={informationTypeList || []}/>
          </Block>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ThirdPartyPage;
