import React, {useEffect} from "react";
import {Select, TYPE} from "baseui/select";
import {ALIGN, Radio, RadioGroup} from "baseui/radio";
import {intl, useForceUpdate} from "../../util";
import {codelist, ListName} from "../../service/Codelist";
import {Label2} from "baseui/typography";
import {Block} from "baseui/block";
import {getCodelistUsage} from "../../api";
import {Usage} from "../CodeList/CodeListUsage";
import {Spinner} from "baseui/spinner";

const Organizing = () => {

  const [queryType, setQueryType] = React.useState(ListName.DEPARTMENT.toString());
  const [query, setQuery] = React.useState();
  const [selectOptions, setSelectOptions] = React.useState();
  const [usage, setUsage] = React.useState();
  const [isLoading, setLoading] = React.useState();
  const forceUpdate = useForceUpdate();


  useEffect(() => {
    (async () => {
      setLoading(true);
      await codelist.wait();
      setSelectOptions(codelist.getCodes(ListName.DEPARTMENT).map(department => {
        return {id: department.code, label: department.shortName}
      }))
      setLoading(false)
    })();
  }, []);

  useEffect(() => {
    setLoading(true)
    switch (queryType) {
      case ListName.DEPARTMENT:
        console.log(codelist.getCodes(ListName.DEPARTMENT))
        setSelectOptions(codelist.getCodes(ListName.DEPARTMENT).map(d => {
          return {id: d.code, label: d.shortName}
        }));
        break;
      case ListName.SUB_DEPARTMENT:
        console.log(codelist.getCodes(ListName.SUB_DEPARTMENT))
        setSelectOptions(codelist.getCodes(ListName.SUB_DEPARTMENT).map(sb => {
          return {id: sb.code, label: sb.shortName}
        }));
        break;
    }
    setLoading(false)
  }, [queryType]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (query !== undefined) {
        setUsage(await getCodelistUsage(queryType as ListName, query[0].id))
      }
      setLoading(false);
    })()
  }, [query]);

  const update = async () => {
    await codelist.refreshCodeLists()
    forceUpdate()
  }

  return (
    <>
      <Block>
        <Select
          placeholder={intl.search}
          options={selectOptions}
          autoFocus={true}
          onChange={params => {
            setQuery(params.value)
            console.log(params.value)
          }}
          value={query}
          type={TYPE.search}
          clearable={false}
        />
        <RadioGroup
          value={queryType}
          onChange={e => {
            setQuery(undefined);
            setQueryType((e.target as HTMLInputElement).value);
          }}
          align={ALIGN.vertical}
        >
          <Radio value={ListName.DEPARTMENT}>{intl.department}</Radio>
          <Radio value={ListName.SUB_DEPARTMENT}>{intl.subDepartment}</Radio>
        </RadioGroup>
      </Block>
      {!isLoading ? query && (
        <Block marginTop="20px">
          <Label2>{intl.description}</Label2>
          {
            codelist.getDescription(queryType as ListName, query[0].id)
          }
          <Usage refresh={update} usage={usage}/>
        </Block>
      ) : (
        <Block minWidth="100%" display="flex" justifyContent="center">
          <Spinner/>
        </Block>
      )}
    </>
  )
};

export default Organizing;
