import type {Color} from "../Colors"
import {Fragment} from "react/jsx-runtime"
import type {HTMLAttributes} from "react"

import classNames from "classnames/bind"
import styles from "./Text.module.scss"
import React from "react"

const cx = classNames.bind(styles)

export interface TextProps extends HTMLAttributes<HTMLDivElement> {
  // extends이하 - div의 속성을 가져올 수 있음 (....props)
  children?: React.ReactNode
  color?: Color
  size?: "t1" | "t2" | "t3" | "t4" | "t5" | "t6" | "t7"
  bold?: boolean
  inline?: boolean
}

export function Text({
  children,
  color = "grey900",
  size = "t3",
  bold = false,
  inline = false,
  ...props
}: TextProps = {}) {
  if (typeof children !== "string") {
    // ?
    return (
      <div
        className={cx({
          [`color-${color}`]: color,
          [`typography-${size}`]: true,
          bold,
        })}
        style={{
          display: inline === true ? "inline" : "block",
        }}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cx({
        [`color-${color}`]: color,
        [`typography-${size}`]: true,
        bold,
      })}
      style={{
        display: inline === true ? "inline" : "block",
      }}
      {...props}
    >
      {children.split("\\n").map((text: string, idx: number) => (
        <Fragment key={idx}>
          {text}
          <br />
        </Fragment>
      ))}
    </div>
  )
}
