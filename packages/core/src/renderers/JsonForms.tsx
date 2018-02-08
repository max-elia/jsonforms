import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { UnknownRenderer } from './UnknownRenderer';
import { RankedTester } from '../testers';
import { getSchema, getUiSchema } from '../reducers';
import { StatePropsOfScopedRenderer } from './common';

/**
 * Props of the {@link JsonForms} renderer.
 */
export interface JsonFormsProps extends StatePropsOfScopedRenderer {
  /**
   * All renderers that are considered by the dispatch renderer.
   */
  renderers?: { tester: RankedTester, renderer: any }[];
}

const JsonFormsDispatchRenderer = ({ uischema, schema, path, renderers }: JsonFormsProps) => {
  const renderer = _.maxBy(renderers, r => r.tester(uischema, schema));
  if (renderer === undefined || renderer.tester(uischema, schema) === -1) {
    return <UnknownRenderer type={'renderer'}/>;
  } else {
    const Render = renderer.renderer;

    return (
      <Render
        uischema={uischema}
        schema={schema}
        path={path}
        renderers={renderers}
      />
    );
  }
};

const mapStateToProps = (state, ownProps) => ({
  renderers: state.jsonforms.renderers || [],
  schema: ownProps.schema || getSchema(state),
  uischema: ownProps.uischema || getUiSchema(state)
});

export const JsonForms = connect(
  mapStateToProps,
  null
)(JsonFormsDispatchRenderer);