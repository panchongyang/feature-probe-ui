import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useParams } from 'react-router-dom';
import Button from 'components/Button';
import Icon from 'components/Icon';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import { IRouterParams } from 'interfaces/project';
import { getAndroidCode, getGoCode, getJavaCode, getJSCode, getObjCCode, getRustCode, getSwiftCode } from '../constants';
import styles from '../Steps/index.module.scss';

interface IProps {
  currentStep: number;
  currentSDK: string;
  returnType: string;
  sdkVersion: string;
  serverSdkKey: string;
  clientSdkKey: string;
  saveStep(): void;
  goBackToStep(step: number): void;
}

interface ICodeOption {
  title?: string;
  name: string;
  code: string;
}

const CURRENT = 2;

const StepSecond = (props: IProps) => {
  const { currentStep, currentSDK, serverSdkKey, clientSdkKey, returnType, sdkVersion, saveStep, goBackToStep } = props;
  const [ options, saveOptions ] = useState<ICodeOption[]>([]);
  const [ language, saveLanguage ] = useState<string>('java');
  const { toggleKey } = useParams<IRouterParams>();

  useEffect(() => {
    if (currentSDK) {
      switch (currentSDK) {
        case 'Java': 
          saveLanguage('java');
          saveOptions(getJavaCode(sdkVersion, serverSdkKey, toggleKey, returnType));
          break;
        case 'Rust': 
          saveLanguage('rust');
          saveOptions(getRustCode(sdkVersion, serverSdkKey, toggleKey, returnType));
          break;
        case 'Go': 
          saveLanguage('go');
          saveOptions(getGoCode(serverSdkKey, toggleKey, returnType));
          break;
        case 'Android': 
          saveLanguage('java');
          saveOptions(getAndroidCode(sdkVersion, clientSdkKey, toggleKey, returnType));
          break;
        case 'Swift': 
          saveLanguage('swift');
          saveOptions(getSwiftCode(clientSdkKey, toggleKey, returnType));
          break;
        case 'Objective-C': 
          saveLanguage('objectivec');
          saveOptions(getObjCCode(clientSdkKey, toggleKey, returnType));
          break;
        case 'JavaScript': 
          saveLanguage('javascript');
          saveOptions(getJSCode(clientSdkKey, toggleKey, returnType));
          break;
      }
    }
  }, [sdkVersion, currentSDK, clientSdkKey, serverSdkKey, toggleKey, returnType]);

  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        {
          currentStep === CURRENT && (
            <>
              <div className={styles.circleCurrent}>{ CURRENT }</div>
              <div className={styles.lineSelected}></div>
            </>
          )
        }
        {
          currentStep < CURRENT && (
            <>
              <div className={styles.circle}>{ CURRENT }</div>
              <div className={styles.line}></div>
            </>
          )
        }
        {
          currentStep > CURRENT && (
            <>
              <div className={styles.checked}>
                <Icon type='check' />
              </div>
              <div className={styles.lineSelected}></div>
            </>
          )
        }
      </div>
      <div className={styles['step-right']}>
        <div className={styles['step-title']}>
          <FormattedMessage id='connect.third.title' />
        </div>
        <div className={styles['step-detail']}>
          {
            currentStep === CURRENT && (
              <>
                <div>
                  {
                    options.map((item: ICodeOption) => {
                      return (
                        <div>
                          {
                            item.title && <h3 className={styles['code-step-title']}>{item.title}</h3>
                          }
                          <div className={styles['code-step']}>{item.name}</div>
                          <div className={styles.code}>
                            <span className={styles.copy}>
                              <CopyToClipboardPopup text={item.code}>
                                <span className={styles.copyBtn}>
                                  <FormattedMessage id='common.copy.uppercase.text' />
                                </span>
                              </CopyToClipboardPopup>
                            </span>
                            <SyntaxHighlighter 
                              language={language} 
                              style={docco} 
                              wrapLongLines={true} 
                              customStyle={{backgroundColor: 'rgba(33,37,41,0.04);', fontSize: '13px', borderRadius: '6px', minHeight: '36px'}}
                            >
                              {item.code}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                <div>
                  <Button 
                    primary 
                    type='submit'
                    onClick={() => {
                      saveStep();
                    }}
                  >
                    <FormattedMessage id='connect.continue.button' />
                  </Button>
                </div>
              </>
            )
          }
          {
            currentStep > CURRENT && (
              <div className={styles.card}>
                <div className={styles['card-left']}>
                  <FormattedMessage id='connect.third.title' />
                </div>
                <div className={styles['card-right']}>
                  <Icon 
                    type='edit' 
                    onClick={() => {
                      goBackToStep(CURRENT);
                    }} 
                  />
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default StepSecond;