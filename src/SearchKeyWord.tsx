import React, { useState, useRef, useEffect } from 'react'
import { Input } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons';
const hightLightWordClassName = 'test';
const scrollContentHeight = 300;
export default function SearchKeyWord() {
    const [curHeightLightDom, setCurHeightLightDom] = useState<number>(0);
    const [domListLength, setDomListLength] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>("面试");
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollToView = (element: Element) => {
        if (!scrollRef.current) return;
        const { top: elementRectTop, bottom: elementRectBottom } = element.getBoundingClientRect();
        const { top: parentRectTop, bottom: parentRectBottom } = scrollRef.current.getBoundingClientRect();
        if (elementRectTop - parentRectTop > scrollContentHeight) {
            scrollRef.current.scrollTo({
                top: elementRectTop - parentRectTop + scrollRef.current.scrollTop + 20
            })
        }
        if (parentRectBottom - elementRectBottom > scrollContentHeight) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollTop - (parentRectTop  - elementRectBottom) - 20
            })
        }

    }
    /**
     * 从第几个到第几个dom
     */
    const changeDomBgc = (from: number, to: number) => {
        const doms = document.getElementsByClassName(hightLightWordClassName);
        if (!scrollRef.current || !doms) return;
        doms[to] && scrollToView(doms[to]);
        doms[to].setAttribute('style', 'background-color: orange');
        doms[from].setAttribute('style', 'background-color: yellow');
    }
    /**
     * 
     * 上一步或者下一步
     */
    const changeStep = (step: -1 | 1) => {
        if (step === 1) {
            if (curHeightLightDom < domListLength - 1) {
                changeDomBgc(curHeightLightDom, curHeightLightDom + 1);
                setCurHeightLightDom(curHeightLightDom + 1);
            }
        } else if (curHeightLightDom > 0) {
            changeDomBgc(curHeightLightDom, curHeightLightDom - 1);
            setCurHeightLightDom(curHeightLightDom - 1);
        }
    }
    useEffect(() => {
        setCurHeightLightDom(0);
        const doms = document.getElementsByClassName(hightLightWordClassName);
        doms[0] && scrollToView(doms[0]);
        setDomListLength(doms.length);
        doms?.[0]?.setAttribute('style', 'background-color: orange')

    }, [inputValue]);
    useEffect(()=>{
        fetch('/getKeyWord').then(res=>{
            return res.json();
        }).then(res=>{
            setInputValue(res.data);
        })
    },[]);
    const genContent = (text: string) => {
        try {
            return (
                <div dangerouslySetInnerHTML={{
                    __html: text.replace(new RegExp(inputValue, 'g'), `<span class=${hightLightWordClassName} style="background-color: yellow">${inputValue}</span>`)
                }} />
            )
        } catch (error) {

        }
    }
    return (
        <div >
            <Input
                onKeyUp={e => {
                    if (e.key === 'Enter') {
                        changeStep(1);
                    }
                }}
                value={inputValue}
                suffix={
                    inputValue && (
                        <>
                            <span style={{ marginRight: '10px' }}>
                                {curHeightLightDom + (domListLength === 0 ? 0 : 1)}/{domListLength}
                            </span>
                            <UpOutlined
                                style={{ marginRight: '8px', cursor: 'pointer' }}
                                onClick={() =>
                                    changeStep(-1)
                                } />
                            <DownOutlined
                                style={{ marginRight: '8px', cursor: 'pointer' }}
                                onClick={() =>
                                    changeStep(1)
                                } />
                        </>
                    )
                }
                onChange={e => setInputValue(e.target.value)}
                style={{ width: '250px' }}
                allowClear
            />
            <div ref={scrollRef} style={{ height: `${scrollContentHeight}px`, overflow: 'scroll' }}>
                {
                    Array.from({ length: 10 }).map((_, index) => (
                        <div key={index}>
                            {
                                genContent(`以前面试的时候经常被问到响应式相关的内容，而 Vue3.0 更新后，面试官又有了新的武器来考核面试者。
                                **面试官：**为什么 Vue3.0 要重写响应式系统？
                                对于面试者来说，懵逼树上懵逼果，懵逼树下你和我，面试官在问什么，我该怎么回答，完全不知道怎么回事。
                                有些经验的小伙伴可能会从解释 Proxy 的好处开始简单聊一下，比如，Proxy 是直接代理对象，而不是劫持对象的属性，更好的数组监控等。
                                这样的回答，勉强算是合格吧。
                                那到底应该怎么答呢，才能顺利通过面试，赢得 offer？`)
                            }
                        </div>
                    ))
                }
            </div>
            <div>
                {
                    `以前面试的时候经常被问到响应式相关的内容，而 Vue3.0 更新后，面试官又有了新的武器来考核面试者。
                    **面试官：**为什么 Vue3.0 要重写响应式系统？
                    对于面试者来说，懵逼树上懵逼果，懵逼树下你和我，面试官在问什么，我该怎么回答，完全不知道怎么回事。
                    有些经验的小伙伴可能会从解释 Proxy 的好处开始简单聊一下，比如，Proxy 是直接代理对象，而不是劫持对象的属性，更好的数组监控等。
                    这样的回答，勉强算是合格吧。
                    那到底应该怎么答呢，才能顺利通过面试，赢得 offer？`
                }
            </div>
        </div>
    )
}