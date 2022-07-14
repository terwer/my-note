// Terwer - Picking up shells in shallow water to find unknown technical puzzles
// Copyright (c) 20222-present, terwer.space
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

package api

import (
	"github.com/88250/gulu"
	"github.com/gin-gonic/gin"
	"github.com/siyuan-note/siyuan/kernel/conf"
	"github.com/siyuan-note/siyuan/kernel/model"
	"github.com/siyuan-note/siyuan/kernel/util"
	"net/http"
	"time"
)

func setPublish(c *gin.Context) {
	ret := gulu.Ret.NewResult()
	defer c.JSON(http.StatusOK, ret)

	arg, ok := util.JsonArg(c, ret)
	if !ok {
		return
	}

	cnblogsPublishApiUrl := arg["cnblogsPublishApiUrl"].(string)
	cnblogsPublishUsername := arg["cnblogsPublishUsername"].(string)
	cnblogsPublishPassword := arg["cnblogsPublishPassword"].(string)

	model.Conf.Terwer.Publish = &conf.Publish{
		CnblogsPublishApiUrl:   cnblogsPublishApiUrl,
		CnblogsPublishUsername: cnblogsPublishUsername,
		CnblogsPublishPassword: cnblogsPublishPassword,
	}
	model.Conf.Save()

	util.PushMsg(model.Conf.Language(42), 1000*15)
	time.Sleep(time.Second * 3)
}
