import Vue from 'vue'
import {
  Form,
  Input,
  Layout,
  Row,
  Icon,
  Col,
  Select,
  Button,
  Tooltip,
  Modal,
  Menu,
  Card,
  Switch,
  Divider,
  Checkbox
} from 'ant-design-vue'

Vue.component(Switch.name, Switch)
Vue.use(Switch)

Vue.component(Checkbox.name, Checkbox)
Vue.use(Checkbox)

Vue.component(Divider.name, Divider)
Vue.use(Divider)

Vue.component(Card.name, Card)
Vue.use(Card)

Vue.component(Menu.name, Menu)
Vue.component(Menu.Item.name, Menu.Item)
Vue.component(Menu.ItemGroup.name, Menu.ItemGroup)
Vue.use(Menu)

Vue.component(Form.name, Form)
Vue.component(Form.Item.name, Form.Item)
Vue.use(Form)

Vue.component(Input.name, Input)
Vue.component(Input.Group.name, Input.Group)
Vue.use(Input)

Vue.component(Layout.name, Layout)
Vue.component(Layout.Header.name, Layout.Header)
Vue.component(Layout.Content.name, Layout.Content)
Vue.component(Layout.Footer.name, Layout.Footer)
Vue.use(Layout)

Vue.component(Row.name, Row)
Vue.component(Icon.name, Icon)
Vue.component(Col.name, Col)
Vue.use(Row)
Vue.use(Icon)
Vue.use(Col)

Vue.component(Select.name, Select)
Vue.component(Select.Option.name, Select.Option)
Vue.component(Select.OptGroup.name, Select.OptGroup)
Vue.use(Select)

Vue.component(Button.name, Button)
Vue.component(Button.Group.name, Button.Group)
Vue.use(Button)

Vue.component(Tooltip.name, Tooltip)
Vue.use(Tooltip)

Vue.component(Modal.name, Modal)
Vue.use(Modal)
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$success = Modal.success

