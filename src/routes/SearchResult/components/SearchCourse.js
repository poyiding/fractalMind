import React, { PureComponent } from 'react';
import { Pagination, Spin } from 'antd';
import { connect } from 'dva';
import { stringify } from 'qs';
import CourseItem from '../../training/components/CourseItem';
import NoData from 'components/NoData';
import request from '../../../utils/request';
import { getUrlParameter } from '../../../utils/utils';

@connect(({searchResult}) => ({
  keyword: searchResult.keyword,
}))
export default class SearchCourse extends PureComponent {
  state = {
    loading: true,
    courseData: {},
  }
  componentDidMount() {
    this.queryCourseList();
  }
  componentWillReceiveProps(nextProps) {
    // 监听路由 keyword 变化 重新查询
    if(this.props.keyword !== nextProps.keyword) {
      this.queryCourseList();
    }
  }
  queryCourseList(current = 1 ) {
    const keyword = getUrlParameter('keyword') || '';
    const params = {
      current,
      limit: 10,
      condition: decodeURI(keyword),
    };
    this.setState({
      loading: true,
    });
    request({
      url: `/web/train/page?${stringify(params)}`,
      onSuccess: (res) => {
        this.setState({ courseData: res, loading: false });
      },
    });
  }
  onChangePage = (current) => {
    this.queryCourseList(current);
  }

  render() {
    const { courseData, loading } = this.state;
    const { rows = [], total = 0, current = 1 } = courseData;

    return (
      <>
        <Spin spinning={loading}>
          {
            rows.map(item => (
              <CourseItem key={item.id} info={item} />
            ))
          }
          { rows.length < 1 && <NoData /> }
        </Spin>
        { total > 10 && (
          <Pagination
            style={{ float: 'right' }}
            pageSize={limit}
            current={current}
            total={total}
            onChange={this.onChangePage}
          />
        )}
      </>
    );
  }
}
