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

package conf

type Terwer struct {
	Publish *Publish `json:"publish"`
}

func NewTerwer() *Terwer {
	return &Terwer{
		Publish: &Publish{},
	}
}

type Publish struct {
	CnblogsPublishApiUrl   string `json:"cnblogsPublishApiUrl"`
	CnblogsPublishUsername string `json:"cnblogsPublishUsername"`
	CnblogsPublishPassword string `json:"cnblogsPublishPassword"`
}
