package jesscofield.crm.controller;

import jesscofield.crm.domain.appointment.Appointment;
import jesscofield.crm.domain.customer.Customer;
import jesscofield.crm.repository.AppointmentRepository;
import jesscofield.crm.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Get all appointments
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Get appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new appointment
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        // Validate customer exists
        if (appointment.getCustomer() != null && appointment.getCustomer().getId() != null) {
            Customer customer = customerRepository.findById(appointment.getCustomer().getId())
                    .orElse(null);
            appointment.setCustomer(customer);
        }
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAppointment);
    }

    // Update appointment
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails) {
        return appointmentRepository.findById(id)
                .map(existingAppointment -> {
                    existingAppointment.setTitle(appointmentDetails.getTitle());
                    existingAppointment.setDateTime(appointmentDetails.getDateTime());
                    existingAppointment.setDescription(appointmentDetails.getDescription());
                    existingAppointment.setLocation(appointmentDetails.getLocation());
                    if (appointmentDetails.getCustomer() != null && appointmentDetails.getCustomer().getId() != null) {
                        Customer customer = customerRepository.findById(appointmentDetails.getCustomer().getId())
                                .orElse(null);
                        existingAppointment.setCustomer(customer);
                    }
                    return ResponseEntity.ok(appointmentRepository.save(existingAppointment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointmentRepository.delete(appointment);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}