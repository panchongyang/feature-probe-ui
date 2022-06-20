import { useCallback } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { FormattedMessage, useIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import SectionTitle from 'components/SectionTitle';
import Icon from 'components/Icon';
import Rule from 'components/Rule';
import { IRule } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import styles from './index.module.scss';
const MAX_RULES = 30;

interface IProps {
  useSegment?: boolean;
  ruleContainer: IContainer;
  variationContainer?: IContainer;
  hooksFormContainer: IContainer;
  segmentContainer?: IContainer;
}

const Rules = (props: IProps) => {
  const intl = useIntl();
  const { useSegment, ruleContainer, variationContainer, hooksFormContainer, segmentContainer } = props;
  const { 
    rules,
    saveRules,
    handleAddRule, 
  } = ruleContainer.useContainer();

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const copyRules = cloneDeep(rules);
    const [removed] = copyRules.splice(result.source.index, 1);
    copyRules.splice(result.destination.index, 0, removed);
    saveRules([...copyRules]);
  }, [rules, saveRules]);

	return (
		<div className={styles.rules}>
      <SectionTitle
        title={intl.formatMessage({id: 'common.rules.text'})}
        showTooltip={true}
        tooltipText={intl.formatMessage({id: 'targeting.rules.tips'})}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className={styles['rules-container']}>
                {
                  rules && rules.map((rule: IRule, index: number) => {
                    return (
                      <Rule
                        key={rule.id}
                        rule={rule}
                        index={index}
                        useSegment={useSegment}
                        ruleContainer={ruleContainer}
                        segmentContainer={segmentContainer}
                        hooksFormContainer={hooksFormContainer}
                        variationContainer={variationContainer}
                      />
                    )
                  })
                }
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div 
        className={`${rules.length >= MAX_RULES && styles['add-disabled']} ${styles.add}`} 
        onClick={() => {
          if (rules.length >= MAX_RULES) {
            return;
          }
          handleAddRule();
        }}
      >
        <Icon customClass={styles['iconfont']} type='add' />
        <FormattedMessage id='targeting.rule.add.text'/>
      </div>
		</div>
	)
}

export default Rules;
