package jesscofield.crm.domain.company;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jesscofield.crm.domain.user.User;
import jesscofield.crm.domain.user.Department;
import java.util.Collection;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    private String phone;

    @ManyToOne
    @JoinColumn(name = "company_type_id")
    private CompanyType companyType;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private Collection<User> users;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private Collection<Department> departments;
}