import axios from "axios"
import { PageResponse, Process, ProcessFormValues, ProcessPurposeCount } from "../constants"
import { env } from "../util/env"
import { convertLegalBasesToFormValues } from "./PolicyApi"

export const getProcess = async (processId: string) => {
  return (await axios.get<Process>(`${env.pollyBaseUrl}/process/${processId}`)).data
}

export const getProcessesForPurpose = async (purpose: string) => {
  return (await axios.get<PageResponse<Process>>(`${env.pollyBaseUrl}/process/purpose/${purpose}`)).data
}

export const getProcessPurposeCount = async () => {
  return (await axios.get<ProcessPurposeCount>(`${env.pollyBaseUrl}/process/count/purpose`)).data
}

export const createProcess = async (process: ProcessFormValues) => {
  let body = mapProcessFromForm(process)
  return (await axios.post<Process>(`${env.pollyBaseUrl}/process`, body)).data
}

export const deleteProcess = async (processId: string) => {
  return (await axios.delete<Process>(`${env.pollyBaseUrl}/process/${processId}`)).data
}

export const updateProcess = async (process: ProcessFormValues) => {
  let body = mapProcessFromForm(process)
  return (await axios.put<Process>(`${env.pollyBaseUrl}/process/${process.id}`, body)).data
}

const mapBool = (b?: boolean) => b === true ? true : b === false ? false : undefined

export const convertProcessToFormValues = (process?: Process) => {
  const {
    id,
    purposeCode,
    name,
    description,
    department,
    subDepartment,
    productTeam,
    legalBases,
    start,
    end,
    automaticProcessing,
    profiling,
    dataProcessor,
    dataProcessorAgreements,
    dataProcessorOutsideEU
  } = (process || {})

  return {
    legalBasesOpen: false,
    id: id,
    name: name,
    description: description || undefined,
    purposeCode: purposeCode,
    department: (department && department.code) || undefined,
    subDepartment: (subDepartment && subDepartment.code) || undefined,
    productTeam: productTeam || undefined,
    legalBases: convertLegalBasesToFormValues(legalBases),
    start: start || undefined,
    end: end || undefined,
    automaticProcessing: process ? mapBool(automaticProcessing) : false,
    profiling: process ? mapBool(profiling) : false,
    dataProcessor: mapBool(dataProcessor),
    dataProcessorAgreements: dataProcessorAgreements || [],
    dataProcessorOutsideEU: mapBool(dataProcessorOutsideEU),
  } as ProcessFormValues
}

export const mapProcessFromForm = (values: ProcessFormValues) => {
  return {
    id: values.id,
    name: values.name,
    description: values.description,
    purposeCode: values.purposeCode,
    department: values.department ? values.department : undefined,
    subDepartment: values.subDepartment ? values.subDepartment : undefined,
    productTeam: values.productTeam,
    legalBases: values.legalBases ? values.legalBases : [],
    start: values.start,
    end: values.end,
    automaticProcessing: values.automaticProcessing,
    profiling: values.profiling,
    dataProcessor: values.dataProcessor,
    dataProcessorAgreements: values.dataProcessor ? values.dataProcessorAgreements : [],
    dataProcessorOutsideEU: values.dataProcessor ? values.dataProcessorOutsideEU : undefined,
  }
}
