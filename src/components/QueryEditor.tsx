import React, { PureComponent } from 'react';
import { QueryEditorProps } from '@grafana/data';
import { InlineFormLabel, SegmentAsync, QueryField } from '@grafana/ui';
import { DataSource } from '../datasource';
import { AwsAthenaQuery, AwsAthenaOptions } from '../types';

type Props = QueryEditorProps<DataSource, AwsAthenaQuery, AwsAthenaOptions>;

interface State {
  region: string;
  workgroup: string;
  queryExecutionId: string;
  timestampColumn: string;
  valueColumn: string;
  legendFormat: string;
  timeFormat: string;
  maxRows: string;
  cacheDuration: string;
  queryString: string;
}

export class QueryEditor extends PureComponent<Props, State> {
  query: AwsAthenaQuery;

  constructor(props: Props) {
    super(props);
    const defaultQuery: Partial<AwsAthenaQuery> = {
      format: 'timeserie',
      region: '',
      workgroup: '',
      queryExecutionId: '',
      timestampColumn: '',
      valueColumn: '',
      legendFormat: '',
      timeFormat: '',
      maxRows: '1000',
      cacheDuration: '',
      queryString: '',
    };
    const query = Object.assign({}, defaultQuery, props.query);
    this.query = query;
    this.state = {
      region: query.region,
      workgroup: query.workgroup,
      queryExecutionId: query.queryExecutionId,
      timestampColumn: query.timestampColumn,
      valueColumn: query.valueColumn,
      legendFormat: query.legendFormat,
      timeFormat: query.timeFormat,
      maxRows: query.maxRows,
      cacheDuration: query.cacheDuration,
      queryString: query.queryString,
    };
  }

  onRegionChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const region = e.currentTarget.value;
    this.query.region = region;
    this.setState({ region });
  };

  onWorkgroupChange = (item: any) => {
    let workgroup = 'primary';
    if (item.value) {
      workgroup = item.value;
    }
    this.query.workgroup = workgroup;
    this.setState({ workgroup });
    const { query, onChange, onRunQuery } = this.props;
    if (onChange) {
      onChange({ ...query, workgroup: workgroup });
      if (onRunQuery && query.queryString !== '') {
        onRunQuery();
      }
    }
  };

  onQueryExecutionIdChange = (item: any) => {
    if (!item.value) {
      return;
    }
    const queryExecutionId = item.value;
    this.query.queryExecutionId = queryExecutionId;
    this.setState({ queryExecutionId });
    const { onRunQuery } = this.props;
    onRunQuery();
  };

  onTimestampColumnChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const timestampColumn = e.currentTarget.value;
    this.query.timestampColumn = timestampColumn;
    this.setState({ timestampColumn });
  };

  onValueColumnChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const valueColumn = e.currentTarget.value;
    this.query.valueColumn = valueColumn;
    this.setState({ valueColumn });
  };

  onLegendFormatChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const legendFormat = e.currentTarget.value;
    this.query.legendFormat = legendFormat;
    this.setState({ legendFormat });
  };

  onTimeFormatChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const timeFormat = e.currentTarget.value;
    this.query.timeFormat = timeFormat;
    this.setState({ timeFormat });
  };

  onMaxRowsChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const maxRows = e.currentTarget.value;
    this.query.maxRows = maxRows;
    this.setState({ maxRows });
  };

  onCacheDurationChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const cacheDuration = e.currentTarget.value;
    this.query.cacheDuration = cacheDuration;
    this.setState({ cacheDuration });
  };

  onQueryStringChange = (value: string, override?: boolean) => {
    const queryString = value;
    this.query.queryString = queryString;
    this.setState({ queryString });

    const { query, onChange, onRunQuery } = this.props;
    if (onChange) {
      onChange({ ...query, queryString: queryString });
      if (override && onRunQuery) {
        onRunQuery();
      }
    }
  };

  onRunQuery = () => {
    const { query } = this;
    this.props.onChange(query);
    this.props.onRunQuery();
  };

  render() {
    const { datasource } = this.props;
    const {
      region,
      workgroup,
      queryExecutionId,
      timestampColumn,
      valueColumn,
      legendFormat,
      timeFormat,
      maxRows,
      cacheDuration,
      queryString,
    } = this.state;
    return (
      <>
        <div className="gf-form-inline">
          <div className="gf-form">
            <InlineFormLabel width={8}>Region</InlineFormLabel>
            <input
              type="text"
              className="gf-form-input"
              placeholder="us-east-1"
              value={region}
              onChange={this.onRegionChange}
              onBlur={this.onRunQuery}
            />
          </div>

          <div className="gf-form">
            <InlineFormLabel width={8}>Workgroup</InlineFormLabel>
            <SegmentAsync
              loadOptions={() => datasource.getWorkgroupNameOptions(region)}
              placeholder="Enter Workgroup"
              value={workgroup}
              allowCustomValue={true}
              onChange={this.onWorkgroupChange}
            ></SegmentAsync>
          </div>
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <InlineFormLabel width={8}>Query Execution Id</InlineFormLabel>
            <SegmentAsync
              loadOptions={() => datasource.getQueryExecutionIdOptions(region, workgroup)}
              placeholder="Enter Query Execution Id"
              value={queryExecutionId}
              allowCustomValue={true}
              onChange={this.onQueryExecutionIdChange}
            ></SegmentAsync>
          </div>

          {datasource.outputLocation !== '' && (
            <div className="gf-form">
              <QueryField
                query={queryString}
                onBlur={this.props.onBlur}
                onChange={this.onQueryStringChange}
                onRunQuery={this.props.onRunQuery}
                placeholder="Enter a AWS Athena Query (run with Shift+Enter)"
                portalOrigin="aws-athena"
              />
            </div>
          )}
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <InlineFormLabel width={8}>Legend Format</InlineFormLabel>
            <input
              type="text"
              className="gf-form-input"
              placeholder=""
              value={legendFormat}
              onChange={this.onLegendFormatChange}
              onBlur={this.onRunQuery}
            />
          </div>

          <div className="gf-form">
            <InlineFormLabel width={8}>Max Rows</InlineFormLabel>
            <input
              type="text"
              className="gf-form-input"
              placeholder="-1"
              value={maxRows}
              onChange={this.onMaxRowsChange}
              onBlur={this.onRunQuery}
            />
          </div>

          <div className="gf-form">
            <InlineFormLabel width={8}>Cache Duration</InlineFormLabel>
            <input
              type="text"
              className="gf-form-input"
              placeholder="0s"
              value={cacheDuration}
              onChange={this.onCacheDurationChange}
              onBlur={this.onRunQuery}
            />
          </div>
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <InlineFormLabel width={8}>Timestamp Column</InlineFormLabel>
            <input
              type="text"
              className="gf-form-input"
              placeholder=""
              value={timestampColumn}
              onChange={this.onTimestampColumnChange}
              onBlur={this.onRunQuery}
            />
          </div>

          <div className="gf-form">
            <InlineFormLabel width={8}>Value Column</InlineFormLabel>
            <input
              type="text"
              className="gf-form-input"
              placeholder=""
              value={valueColumn}
              onChange={this.onValueColumnChange}
              onBlur={this.onRunQuery}
            />
          </div>

          <div className="gf-form">
            <InlineFormLabel width={8}>Time Format</InlineFormLabel>
            <input
              type="text"
              className="gf-form-input"
              placeholder=""
              value={timeFormat}
              onChange={this.onTimeFormatChange}
              onBlur={this.onRunQuery}
            />
          </div>
        </div>
      </>
    );
  }
}
