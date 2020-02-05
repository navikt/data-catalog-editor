import axios from "axios";
import { Disclosure, DisclosureFormValues, PageResponse } from "../constants";
import { createDocument, updateDocument } from "./DocumentApi"
import { env } from "../util/env"
import { convertLegalBasesToFormValues } from "./PolicyApi"

export const getAllDisclosures = async (pageSize: number, pageNumber: number) => {
    return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure?pageSize=${pageSize}&pageNumber=${pageNumber}`)).data.content;
};

export const getDisclosure = async (disclosureId: string) => {
    return (await axios.get<Disclosure>(`${env.pollyBaseUrl}/disclosure/${disclosureId}`)).data;
};

export const getDisclosuresByRecipient = async (recipient: string) => {
    return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure/?recipient=${recipient}`)).data.content
}

export const getDisclosuresByInformationTypeId = async (informationTypeId: string) => {
    return (await axios.get<PageResponse<Disclosure>>(`${env.pollyBaseUrl}/disclosure/?informationTypeId=${informationTypeId}`)).data.content
}

export const createDisclosure = async (disclosure: DisclosureFormValues) => {
    let doc = disclosure.document
    if (doc) {
        const createDoc = await createDocument(doc)
        disclosure.documentId = createDoc.id
    }
    let body = mapDisclosureFromForm(disclosure);
    return (await axios.post<Disclosure>(`${env.pollyBaseUrl}/disclosure`, body)).data;
};

export const updateDisclosure = async (disclosure: DisclosureFormValues) => {
    let doc = disclosure.document
    if (doc && doc.id) {
        await updateDocument(doc)
        disclosure.documentId = doc.id
    } else if (doc) {
        const createDoc = await createDocument(doc)
        disclosure.documentId = createDoc.id
    }
    console.log(disclosure, "DISCL")
    let body = mapDisclosureFromForm(disclosure);
    return (
        await axios.put<Disclosure>(`${env.pollyBaseUrl}/disclosure/${body.id}`, body)
    ).data;
};

export const deleteDisclosure = async (disclosureId: string) => {
    return (await axios.delete<Disclosure>(`${env.pollyBaseUrl}/disclosure/${disclosureId}`)).data
}

export const mapDisclosureFromForm = (values: DisclosureFormValues) => {
    return {
        id: values.id,
        name: values.name || 'na',
        recipient: values.recipient,
        recipientPurpose: values.recipientPurpose,
        documentId: values.documentId,
        description: values.description,
        legalBases: values.legalBases ? values.legalBases : [],
        start: values.start,
        end: values.end
    };
};

export const mapDisclosureToFormValues: (disclosure: Disclosure) => DisclosureFormValues = (disclosure) => ({
  id: disclosure.id,
  name: disclosure.name || undefined,
  description: disclosure ? disclosure.description : '',
  recipient: disclosure.recipient.code || '',
  recipientPurpose: disclosure ? disclosure.recipientPurpose : '',
  document: disclosure.document ?
    {...disclosure.document, informationTypes: disclosure.document.informationTypes.map(it => it.informationType)} :
    {informationTypes: [], name: 'autosel', description: 'autodesc'},
  legalBases: convertLegalBasesToFormValues(disclosure?.legalBases || []),
  legalBasesOpen: false,
  start: disclosure.start || undefined,
  end: disclosure.end || undefined
})
