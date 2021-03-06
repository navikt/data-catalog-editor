import * as React from 'react'

import ProcessList from '../components/Purpose'
import {ListName} from '../service/Codelist'
import {generatePath, useParams} from 'react-router-dom'
import {Process, ProcessStatus} from '../constants'
import {useQueryParam} from '../util/hooks'
import {processPath} from '../routes'
import * as queryString from 'query-string'
import {PageHeader} from '../components/common/PageHeader'

export enum Section {
  purpose = 'purpose',
  system = 'system',
  department = 'department',
  subdepartment = 'subdepartment',
  team = 'team',
  productarea = 'productarea'
}

export const listNameForSection = (section: Section) => {
  if (section === Section.subdepartment) return ListName.SUB_DEPARTMENT
  else if (section === Section.department) return ListName.DEPARTMENT
  else if (section === Section.purpose) return ListName.PURPOSE
  else if (section === Section.system) return ListName.SYSTEM
  return undefined
}

export type PathParams = {
  section: Section,
  code: string,
  processId?: string
}

const ProcessPage = () => {
  const filter = useQueryParam<ProcessStatus>('filter')
  const params = useParams<PathParams>()
  const {section, code, processId} = params

  return (
    <>
      <PageHeader section={section} code={code}/>
      <ProcessList code={code} listName={listNameForSection(section)} processId={processId} filter={filter} section={section}/>
    </>
  )
}

export default ProcessPage

export const genProcessPath = (section: Section, code: string, process?: Partial<Process>, filter?: ProcessStatus, create?: boolean) =>
  generatePath(processPath, {
    section,
    code: section === Section.purpose && !!process?.purpose ? process.purpose.code : code,
    processId: process?.id
  }) + '?' + queryString.stringify({filter, create}, {skipNull: true})
