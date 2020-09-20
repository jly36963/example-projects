<script>
  import NavItem from './NavItem';

  export default {
    data: function() {
      return {
        items: [
          { 
            url: '/', 
            label: 'Home' 
          },
          { 
            url: '/about-us', 
            label: 'About Us' 
          }
        ],
        activeMenuItem: null
      }
    },
    components: {
      NavItem
    },
    render: function(h) {
      return (
        <nav class="bg-white mt-0 w-full flex fixed items-center border-b-2">
          <div class="w-full md:w-1/4 inline-block">
            <div class="flex text-white font-extrabold px-4 py-2">
              <NuxtLink to="/">
                <img src="/logo.png" alt="Invitation Homes" />
              </NuxtLink>
            </div>
          </div>

          <div class="w-full md:w-4/5 lg:w-10/12 inline-block">
            <div class="w-full flex text-sm p-2 items-end content-end justify-end">
              <ul class="list-reset flex justify-between flex-1 md:flex-none items-center">
                {this.items.map((item, i) => (
                  <li
                    class="mr-2 relative"
                    onMouseEnter={() => { this.activeMenuItem = i }}
                    onMouseLeave={() => { this.activeMenuItem = false }}
                  >
                    <NavItem
                      key={item.label}
                      url={item.url}
                      active={this.activeMenuItem === i}
                      label={item.label}
                    >
                      {item.label}
                    </NavItem>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      )
    }
  }
</script>



