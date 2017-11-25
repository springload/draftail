import React from 'react';
import { shallow } from 'enzyme';
import { Editor } from 'draft-js';
import DraftailEditor from '../components/DraftailEditor';

describe('DraftailEditor', () => {
    it('empty', () => {
        expect(shallow(<DraftailEditor />)).toBeDefined();
    });

    it('#readOnly', () => {
        expect(
            shallow(<DraftailEditor />)
                .setState({
                    readOnly: true,
                })
                .hasClass('editor--readonly'),
        ).toBeTruthy();
    });

    it('#placeholder', () => {
        expect(
            shallow(<DraftailEditor placeholder="Write here…" />)
                .find(Editor)
                .prop('placeholder'),
        ).toEqual('Write here…');
    });

    it('#spellCheck', () => {
        expect(
            shallow(<DraftailEditor spellCheck={true} />)
                .find(Editor)
                .prop('spellCheck'),
        ).toEqual(true);
    });
});
